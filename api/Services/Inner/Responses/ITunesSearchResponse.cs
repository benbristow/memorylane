using System.Collections.Generic;
using Newtonsoft.Json;

namespace MemoryLane.Api.Services.Inner.Responses;

public class ITunesSongResult
{
    [JsonProperty("trackId")]
    public long TrackId { get; set; }

    [JsonProperty("trackName")]
    public string TrackName { get; set; }

    [JsonProperty("artistName")]
    public string ArtistName { get; set; }

    [JsonProperty("collectionName")]
    public string CollectionName { get; set; }

    [JsonProperty("artworkUrl100")]
    public string ArtworkUrl100 { get; set; }

    [JsonProperty("previewUrl")]
    public string PreviewUrl { get; set; }

    [JsonProperty("releaseDate")]
    public string ReleaseDate { get; set; }
}

public class ITunesSearchResponse
{
    [JsonProperty("resultCount")]
    public int ResultCount { get; set; }

    [JsonProperty("results")]
    public List<ITunesSongResult> Results { get; set; }
}
