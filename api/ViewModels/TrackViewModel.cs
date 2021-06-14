using MemoryLane.Api.BusinessModels;

namespace MemoryLane.Api.ViewModels
{
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

        public string Artist { get; }

        public string Id { get; }

        public string Image { get; }

        public string Preview { get; }

        public string Title { get; }
    }
}