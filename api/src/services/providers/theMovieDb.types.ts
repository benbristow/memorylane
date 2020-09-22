export interface IDiscoverMovieResponseResult {
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
}

export interface IDiscoverMoviesResponse {
  results: IDiscoverMovieResponseResult[];
}