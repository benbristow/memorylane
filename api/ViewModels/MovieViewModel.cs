using System;
using MemoryLane.Api.BusinessModels;
using Newtonsoft.Json;

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

        [JsonProperty]
        public DateTime Date { get; }

        [JsonProperty]
        public string Description { get; }

        [JsonProperty]
        public int Id { get; }

        [JsonProperty]
        public string Image { get; }

        [JsonProperty]
        public string Title { get; }
    }
}