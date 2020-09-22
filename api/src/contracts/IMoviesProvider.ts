import { IMovie } from "../models/IMovie";

export interface IMoviesProvider {
  getMoviesForYear(year: number): Promise<IMovie[]>;
}