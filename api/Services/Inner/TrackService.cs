using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using MemoryLane.Api.BusinessModels;
using MemoryLane.Api.Services.Inner.Responses;
using Newtonsoft.Json;

namespace MemoryLane.Api.Services.Inner;

public interface ITrackService
{
    Task<IEnumerable<TrackBusinessModel>> GetTracksForYear(int year);
}

public class TrackService : ITrackService
{
    private static readonly HttpClient HttpClient = new()
    {
        BaseAddress = new Uri("https://itunes.apple.com/")
    };

    public async Task<IEnumerable<TrackBusinessModel>> GetTracksForYear(int year)
    {
        try
        {
            var json = await HttpClient.GetStringAsync(
                $"search?term={year}&entity=song&limit=200&country=gb");

            var response = JsonConvert.DeserializeObject<ITunesSearchResponse>(json);

            if (response?.Results == null || !response.Results.Any())
            {
                return Enumerable.Empty<TrackBusinessModel>();
            }

            var validTracks = response.Results
                .Where(track => !string.IsNullOrEmpty(track.PreviewUrl) && !string.IsNullOrEmpty(track.ArtworkUrl100))
                .ToList();

            string yearString = year.ToString();

            // Prioritize songs whose release date begins with the specified year
            var exactYearTracks = validTracks
                .Where(track => !string.IsNullOrEmpty(track.ReleaseDate) && track.ReleaseDate.StartsWith(yearString))
                .ToList();

            // Fallback / secondary: songs whose album/collection references the year
            var albumYearTracks = validTracks
                .Where(track => !exactYearTracks.Contains(track) &&
                                !string.IsNullOrEmpty(track.CollectionName) &&
                                track.CollectionName.Contains(yearString))
                .ToList();

            var combined = exactYearTracks
                .Concat(albumYearTracks)
                .GroupBy(track => track.TrackId)
                .Select(g => g.First())
                .ToList();

            // If still empty (e.g. vintage years), take the top results with valid audio previews
            if (!combined.Any())
            {
                combined = validTracks.Take(20).ToList();
            }

            return combined.Select(track => new TrackBusinessModel
            {
                Artist = track.ArtistName,
                Id = track.TrackId.ToString(),
                Image = track.ArtworkUrl100?.Replace("100x100bb", "600x600bb"),
                Preview = track.PreviewUrl,
                Title = track.TrackName
            });
        }
        catch (Exception)
        {
            return Enumerable.Empty<TrackBusinessModel>();
        }
    }
}