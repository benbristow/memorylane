import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import PlayStore from './PlayStore';
import { YearData } from '../types';

export class DataStore {
  year: number;
  loading: boolean = false;
  data: Partial<YearData> = {};
  cache: Record<number, YearData> = {};
  playStore: PlayStore;

  constructor() {
    this.playStore = new PlayStore();
    this.year = new Date().getFullYear();
    makeAutoObservable(this, {}, { autoBind: true });
    this.update();
  }

  setYear(year: number): void {
    this.year = year;
  }

  update(): void {
    this.loading = true;

    if (this.cache[this.year]) {
      this.updateFromCache();
      return;
    }

    axios
      .get<YearData>('/api/GetYear', { params: { year: this.year } })
      .then((response) => {
        runInAction(() => {
          this.cache[this.year] = {
            movies: response.data.movies ?? [],
            tracks: response.data.tracks ?? []
          };
          this.updateFromCache();
        });
      })
      .catch(() => {
        runInAction(() => {
          this.cache[this.year] = { movies: [], tracks: [] };
          this.updateFromCache();
        });
      });
  }

  updateFromCache(): void {
    this.data = this.cache[this.year] ?? {};
    this.loading = false;
  }
}

export default DataStore;
