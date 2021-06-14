using System;
using MemoryLane.Api.BusinessModels;

namespace MemoryLane.Api.ViewModels
{
    public class MovieViewModel
    {
        public MovieViewModel(MovieBusinessModel businessModel)
        {
            Date = businessModel.Date;
            Description = businessModel.Description;
            Id = businessModel.Id;
            Image = businessModel.Image;
            Title = businessModel.Title;
        }

        public DateTime Date { get; }

        public string Description { get; }

        public int Id { get; }

        public string Image { get; }

        public string Title { get; }
    }
}