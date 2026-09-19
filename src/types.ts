export interface Track {
  id: string;
  artist: string;
  title: string;
  image: string;
  preview: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export interface YearData {
  movies: Movie[];
  tracks: Track[];
}
