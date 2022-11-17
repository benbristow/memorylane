using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MemoryLane.Api.BusinessModels;
using SpotifyAPI.Web;

namespace MemoryLane.Api.Services.Inner;

public interface ITrackService
{
    Task<IEnumerable<TrackBusinessModel>> GetTracksForYear(int year);
}

public class TrackService : ITrackService
{
    public async Task<IEnumerable<TrackBusinessModel>> GetTracksForYear(int year)
    {
        var spotify = await GetSpotifyClient();

        var searchResponse = await spotify.Search.Item(new SearchRequest(
            SearchRequest.Types.Track,
            $"year:{year}")
        {
            Market = "gb"
        });

        return searchResponse.Tracks.Items!.Select(track => new TrackBusinessModel
        {
            Artist = string.Join(", ", track.Artists.Select(artist => artist.Name)),
            Id = track.Id,
            Image = track.Album.Images.First().Url,
            Preview = track.PreviewUrl,
            Title = track.Name
        });
    }

    private static async Task<SpotifyClient> GetSpotifyClient()
    {
        var config = SpotifyClientConfig.CreateDefault();

        var request = new ClientCredentialsRequest(MemoryLaneConfig.Spotify.ClientId, MemoryLaneConfig.Spotify.ClientSecret);
        var response = await new OAuthClient(config).RequestToken(request);

        return new SpotifyClient(config.WithToken(response.AccessToken));
    }
}