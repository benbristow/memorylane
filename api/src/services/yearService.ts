import { exception } from "console";
import { IYearResponse } from "../models/IYearResponse";
import { Spotify } from "./providers/spotify";
import { TheMovieDb } from "./providers/theMovieDb";

export class YearService {
  static async GetYear(year: number): Promise<IYearResponse> {
    if (year < 1925 || year > new Date().getFullYear()) {
      throw "Invalid Year";
    }

    const tracks = await new Spotify().getTracksForYear(year);
    const movies = await new TheMovieDb().getMoviesForYear(year);

    return {
      meta: {
        criteria: {
          year: year
        }
      },
      tracks,
      movies
    } as IYearResponse;
  }
}