using System.Collections.Generic;

namespace MemoryLane.Api.BusinessModels
{
    public class YearBusinessModel
    {
        public IEnumerable<MovieBusinessModel> Movies { get; set; }
        public IEnumerable<TrackBusinessModel> Tracks { get; set; }
        public int Year { get; set; }
    }
}