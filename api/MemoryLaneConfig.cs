using System;

namespace MemoryLane.Api;

public static class MemoryLaneConfig
{
    public static class TheMovieDb
    {
        public static string ApiKey => Environment.GetEnvironmentVariable("THEMOVIEDB_API_KEY");
    }
}