using System.Collections.Generic;
using System.Linq;
using MemoryLane.Api.BusinessModels;

namespace MemoryLane.Api.ViewModels;

public class YearViewModel
{
    public YearViewModel(YearBusinessModel businessModel)
    {
        Meta = new MetaViewModel
        {
            Criteria = new CriteriaViewModel
            {
                Year = businessModel.Year
            }
        };

        Movies = businessModel.Movies.Select(x => new MovieViewModel(x));
        Tracks = businessModel.Tracks.Select(x => new TrackViewModel(x));
    }

    public MetaViewModel Meta { get; }

    public IEnumerable<MovieViewModel> Movies { get; }

    public IEnumerable<TrackViewModel> Tracks { get; }
}