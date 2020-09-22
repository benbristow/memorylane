# frozen_string_literal: true

class TheMovieDB
  def initialize
    Tmdb::Api.key(ENV['THEMOVIEDB_API_KEY'])
    Tmdb::Api.language('en')
  end

  def top_movies_by_year(year)
    Tmdb::Discover.movie(year: year, region: 'us').results.map { |movie| format_movie(movie) }
  end

  private

  def format_movie(movie)
    {
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: "https://image.tmdb.org/t/p/w500#{movie.poster_path}",
      date: movie.release_date
    }
  end
end
