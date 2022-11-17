using Newtonsoft.Json;

namespace MemoryLane.Api.ViewModels;

public class CriteriaViewModel
{
    [JsonProperty]
    public int Year { get; init; }
}