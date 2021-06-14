using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using MemoryLane.Api.BusinessModels;
using MemoryLane.Api.Services.Inner.Responses;
using Newtonsoft.Json;

namespace MemoryLane.Api.Services.Inner
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieBusinessModel>> GetMoviesForYear(int year);
    }

    public class MovieService : IMovieService
    {
        private readonly HttpClient _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://api.themoviedb.org/3/")
        };

        public async Task<IEnumerable<MovieBusinessModel>> GetMoviesForYear(int year)
        {
            var response = JsonConvert.DeserializeObject<TheMovieDbDiscoverResponse>(await _httpClient.GetStringAsync(
                $"discover/movie?api_key={MemoryLaneConfig.TheMovieDb.ApiKey}&primary_release_year={year}&certification_country=gb"));

            return response!.Results.Select(movie => new MovieBusinessModel
            {
                Date = DateTime.Parse(movie.ReleaseDate),
                Description = movie.Overview,
                Id = movie.Id,
                Image = $"https://image.tmdb.org/t/p/w500{movie.PosterPath}",
                Title = movie.Title
            });
        }
    }
}