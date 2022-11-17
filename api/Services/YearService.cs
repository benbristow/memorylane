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

    public async Task<YearBusinessModel> GetYear(int year) =>
        new()
        {
            Movies = await _movieService.GetMoviesForYear(year),
            Tracks = await _trackService.GetTracksForYear(year),
            Year = year
        };
}