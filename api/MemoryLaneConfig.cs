using System;

namespace MemoryLane.Api;

public static class MemoryLaneConfig
{
    public static class Spotify
    {
        public static string ClientId => Environment.GetEnvironmentVariable("SPOTIFY_CLIENT_ID");
        public static string ClientSecret => Environment.GetEnvironmentVariable("SPOTIFY_CLIENT_SECRET");
    }

    public static class TheMovieDb
    {
        public static string ApiKey => Environment.GetEnvironmentVariable("THEMOVIEDB_API_KEY");
    }
}