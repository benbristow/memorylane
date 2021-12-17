using MemoryLane.Api;
using MemoryLane.Api.Services;
using MemoryLane.Api.Services.Inner;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Startup))]
namespace MemoryLane.Api
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddTransient<IMovieService, MovieService>();
            builder.Services.AddTransient<ITrackService, TrackService>();
            builder.Services.AddTransient<IYearService, YearService>();
        }
    }
}