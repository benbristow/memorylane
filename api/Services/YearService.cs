using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MemoryLane.Api.BusinessModels;
using MemoryLane.Api.Services.Inner;

namespace MemoryLane.Api.Services;

public interface IYearService
{
    Task<YearBusinessModel> GetYear(int year);
}

public class YearService : IYearService
{
    private readonly IMovieService _movieService;
    private readonly ITrackService _trackService;

    public YearService(IMovieService movieService, ITrackService trackService)
    {
        _movieService = movieService;
        _trackService = trackService;
    }

    public async Task<YearBusinessModel> GetYear(int year)
    {
        var moviesTask = _movieService.GetMoviesForYear(year);
        var tracksTask = _trackService.GetTracksForYear(year);

        await Task.WhenAll(moviesTask, tracksTask);

        var movies = (await moviesTask)?.ToList() ?? new List<MovieBusinessModel>();
        var tracks = (await tracksTask)?.ToList() ?? new List<TrackBusinessModel>();

        var limitedTracks = movies.Count > 0 ? tracks.Take(movies.Count) : tracks;

        return new YearBusinessModel
        {
            Movies = movies,
            Tracks = limitedTracks,
            Year = year
        };
    }
}