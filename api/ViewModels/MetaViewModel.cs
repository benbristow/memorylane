using Newtonsoft.Json;

namespace MemoryLane.Api.ViewModels;

public class MetaViewModel
{
    [JsonProperty]
    public CriteriaViewModel Criteria { get; init; }
}