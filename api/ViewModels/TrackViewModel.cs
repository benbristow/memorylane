using MemoryLane.Api.BusinessModels;
using Newtonsoft.Json;

namespace MemoryLane.Api.ViewModels;

public class TrackViewModel
{
    public TrackViewModel(TrackBusinessModel businessModel)
    {
        Artist = businessModel.Artist;
        Id = businessModel.Id;
        Image = businessModel.Image;
        Preview = businessModel.Preview;
        Title = businessModel.Title;
    }

    [JsonProperty]
    public string Artist { get; }

    [JsonProperty]
    public string Id { get; }

    [JsonProperty]
    public string Image { get; }

    [JsonProperty]
    public string Preview { get; }

    [JsonProperty]
    public string Title { get; }
}