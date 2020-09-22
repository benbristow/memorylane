import axios from 'axios';

import { IMoviesProvider } from "../../contracts/IMoviesProvider";
import { IMovie } from "../../models/IMovie";

import { IDiscoverMoviesResponse } from './theMovieDb.types';

export class TheMovieDb implements IMoviesProvider {
  async getMoviesForYear(year: number): Promise<IMovie[]> {
    const discoverResponse = await axios.get<IDiscoverMoviesResponse>('https://api.themoviedb.org/3/discover/movie/', {
      params: {
        api_key: process.env.THEMOVIEDB_API_KEY,
        certification_country: 'us',
        primary_release_year: year
      }
    });

    return discoverResponse.data.results.map(x => ({
      id: x.id,
      title: x.title,
      description: x.overview,
      image: `https://image.tmdb.org/t/p/w500${x.poster_path}`,
      date: new Date(x.release_date)
    }) as IMovie);
  }
}