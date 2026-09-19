using MemoryLane.Api.Services;
using MemoryLane.Api.Services.Inner;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddTransient<IMovieService, MovieService>();
        services.AddTransient<ITrackService, TrackService>();
        services.AddTransient<IYearService, YearService>();
    })
    .Build();

host.Run();
