using System.Collections.Generic;
using Newtonsoft.Json;

namespace MemoryLane.Api.Services.Inner.Responses;

public class TheMovieDbMovieResult
{
    [JsonProperty("adult")]
    public bool Adult { get; init; }

    [JsonProperty("backdrop_path")]
    public string BackdropPath { get; init; }

    [JsonProperty("genre_ids")]
    public List<int> GenreIds { get; init; }

    [JsonProperty("id")]
    public int Id { get; init; }

    [JsonProperty("original_language")]
    public string OriginalLanguage { get; init; }

    [JsonProperty("original_title")]
    public string OriginalTitle { get; init; }

    [JsonProperty("overview")]
    public string Overview { get; init; }

    [JsonProperty("popularity")]
    public double Popularity { get; init; }

    [JsonProperty("poster_path")]
    public string PosterPath { get; init; }

    [JsonProperty("release_date")]
    public string ReleaseDate { get; init; }

    [JsonProperty("title")]
    public string Title { get; init; }

    [JsonProperty("video")]
    public bool Video { get; init; }

    [JsonProperty("vote_average")]
    public double VoteAverage { get; init; }

    [JsonProperty("vote_count")]
    public int VoteCount { get; init; }
}

public class TheMovieDbDiscoverResponse
{
    [JsonProperty("page")]
    public int Page { get; init; }

    [JsonProperty("results")]
    public IEnumerable<TheMovieDbMovieResult> Results { get; init; }

    [JsonProperty("total_pages")]
    public int TotalPages { get; init; }

    [JsonProperty("total_results")]
    public int TotalResults { get; init; }
}
