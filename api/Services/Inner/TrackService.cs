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
            int currentYear = DateTime.UtcNow.Year;

            // For the current year, use the official Apple Music Top Songs chart feeds (GB & US)
            // This provides real, authentic charting hits rather than unranked keyword search matches.
            if (year >= currentYear)
            {
                var chartTracks = await GetCurrentYearChartTracks(year);
                if (chartTracks.Any())
                {
                    return chartTracks;
                }
            }

            string yearString = year.ToString();

            var hitsTask = HttpClient.GetStringAsync(
                $"search?term={Uri.EscapeDataString($"{year} hits")}&entity=song&limit=200&country=gb");
            var yearTask = HttpClient.GetStringAsync(
                $"search?term={Uri.EscapeDataString(yearString)}&entity=song&limit=200&country=gb");
            var topHitsTask = HttpClient.GetStringAsync(
                $"search?term={Uri.EscapeDataString($"top hits {year}")}&entity=song&limit=200&country=gb");
            var albumTask = HttpClient.GetStringAsync(
                $"search?term={Uri.EscapeDataString($"{year} album")}&entity=song&limit=200&country=gb");

            await Task.WhenAll(hitsTask, yearTask, topHitsTask, albumTask);

            var allResults = new List<ITunesSongResult>();
            foreach (var task in new[] { hitsTask, yearTask, topHitsTask, albumTask })
            {
                var json = await task;
                var res = JsonConvert.DeserializeObject<ITunesSearchResponse>(json);
                if (res?.Results != null)
                {
                    allResults.AddRange(res.Results);
                }
            }

            // Exclude spam, ambient BGM, cafe background, tribute, and karaoke covers
            var junkKeywords = new[]
            {
                "bgm", "cafe", "cafes", "cover", "karaoke", "tribute",
                "relaxing", "lo-fi", "lofi", "instrumental", "lullaby",
                "workout", "meditation", "sleep", "ballermann", "schützenfest", "remake"
            };

            bool IsJunk(ITunesSongResult track)
            {
                var artist = track.ArtistName ?? string.Empty;
                var title = track.TrackName ?? string.Empty;
                var collection = track.CollectionName ?? string.Empty;

                return junkKeywords.Any(k =>
                    artist.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                    title.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                    collection.Contains(k, StringComparison.OrdinalIgnoreCase));
            }

            var validTracks = allResults
                .Where(track => !string.IsNullOrEmpty(track.PreviewUrl) &&
                                !string.IsNullOrEmpty(track.ArtworkUrl100) &&
                                !IsJunk(track))
                .ToList();

            // Strictly match songs whose release date is in the specified year
            var exactYearTracks = validTracks
                .Where(track => !string.IsNullOrEmpty(track.ReleaseDate) && track.ReleaseDate.StartsWith(yearString))
                .GroupBy(track => $"{track.ArtistName?.Trim().ToLowerInvariant()}|{track.TrackName?.Trim().ToLowerInvariant()}")
                .Select(g => g.First())
                .ToList();

            // Only if no exact tracks exist at all, check if collection has the year and release date is within +/- 1 year
            var finalTracks = exactYearTracks;
            if (!finalTracks.Any())
            {
                finalTracks = validTracks
                    .Where(track => !string.IsNullOrEmpty(track.CollectionName) &&
                                    track.CollectionName.Contains(yearString) &&
                                    !string.IsNullOrEmpty(track.ReleaseDate) &&
                                    DateTime.TryParse(track.ReleaseDate, out var dt) &&
                                    Math.Abs(dt.Year - year) <= 1)
                    .GroupBy(track => $"{track.ArtistName?.Trim().ToLowerInvariant()}|{track.TrackName?.Trim().ToLowerInvariant()}")
                    .Select(g => g.First())
                    .ToList();
            }

            return finalTracks.Select(track => new TrackBusinessModel
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

    private async Task<List<TrackBusinessModel>> GetCurrentYearChartTracks(int year)
    {
        try
        {
            var gbTask = HttpClient.GetStringAsync("gb/rss/topsongs/limit=100/json");
            var usTask = HttpClient.GetStringAsync("us/rss/topsongs/limit=100/json");

            await Task.WhenAll(gbTask, usTask);

            var rawEntries = new List<Newtonsoft.Json.Linq.JToken>();
            foreach (var task in new[] { gbTask, usTask })
            {
                var json = await task;
                var obj = Newtonsoft.Json.Linq.JObject.Parse(json);
                var entries = obj["feed"]?["entry"] as Newtonsoft.Json.Linq.JArray;
                if (entries != null)
                {
                    rawEntries.AddRange(entries);
                }
            }

            var junkKeywords = new[]
            {
                "bgm", "cafe", "cafes", "cover", "karaoke", "tribute",
                "relaxing", "lo-fi", "lofi", "instrumental", "lullaby",
                "workout", "meditation", "sleep", "ballermann", "schützenfest", "remake"
            };

            var parsed = new List<(TrackBusinessModel track, string releaseDate)>();
            var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var entry in rawEntries)
            {
                var title = entry["im:name"]?["label"]?.ToString();
                var artist = entry["im:artist"]?["label"]?.ToString();
                var id = entry["id"]?["attributes"]?["im:id"]?.ToString() ?? string.Empty;
                var releaseDate = entry["im:releaseDate"]?["label"]?.ToString() ?? string.Empty;

                var images = entry["im:image"] as Newtonsoft.Json.Linq.JArray;
                var image = images?.LastOrDefault()?["label"]?.ToString() ?? string.Empty;
                if (!string.IsNullOrEmpty(image))
                {
                    image = System.Text.RegularExpressions.Regex.Replace(image, @"/\d+x\d+bb", "/600x600bb");
                }

                string preview = string.Empty;
                var links = entry["link"] as Newtonsoft.Json.Linq.JArray;
                if (links != null)
                {
                    var previewLink = links.FirstOrDefault(l =>
                        l?["attributes"]?["rel"]?.ToString() == "enclosure" ||
                        l?["im:assetType"]?.ToString() == "preview");
                    preview = previewLink?["attributes"]?["href"]?.ToString() ?? string.Empty;
                }
                else if (entry["link"] != null)
                {
                    var l = entry["link"];
                    if (l?["attributes"]?["rel"]?.ToString() == "enclosure" ||
                        l?["im:assetType"]?.ToString() == "preview")
                    {
                        preview = l?["attributes"]?["href"]?.ToString() ?? string.Empty;
                    }
                }

                if (string.IsNullOrEmpty(title) || string.IsNullOrEmpty(artist) ||
                    string.IsNullOrEmpty(preview) || string.IsNullOrEmpty(image))
                {
                    continue;
                }

                if (junkKeywords.Any(k =>
                    artist.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                    title.Contains(k, StringComparison.OrdinalIgnoreCase)))
                {
                    continue;
                }

                var key = $"{artist.Trim()}|{title.Trim()}";
                if (!seen.Add(key))
                {
                    continue;
                }

                parsed.Add((new TrackBusinessModel
                {
                    Artist = artist,
                    Id = id,
                    Image = image,
                    Preview = preview,
                    Title = title
                }, releaseDate));
            }

            string yearString = year.ToString();

            // Order so songs specifically released in the current year appear first, followed by top chart hits
            return parsed
                .OrderByDescending(p => p.releaseDate.StartsWith(yearString) ? 1 : 0)
                .Select(p => p.track)
                .ToList();
        }
        catch (Exception)
        {
            return new List<TrackBusinessModel>();
        }
    }
}