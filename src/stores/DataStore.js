import { observable } from 'mobx';
import axios from 'axios';

import PlayStore from './PlayStore';

export class DataStore {
  @observable year;
  @observable loading = false;
  @observable.struct data = {};

  constructor() {
    this.playStore = new PlayStore();
    this.year = new Date().getFullYear();
    this.cache = {};

    this.update();
  }

  setYear(year) {
    this.year = year;
  }

  update() {
    this.loading = true;

    if(this.cache[this.year]) {
      this.updateFromCache();
      return;
    }

    axios.get('/api/GetYear', { params: { year: this.year } })
      .then(response => {
        this.cache[this.year] = {
          movies: response.data.movies,
          tracks: response.data.tracks
        };
        
        this.updateFromCache();
      });
  }

  updateFromCache() {
    this.data = this.cache[this.year];
    this.loading = false;
  }
}

export default DataStore;
