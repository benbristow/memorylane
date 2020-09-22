import { observable } from 'mobx';
import axios from 'axios';
import { soundManager } from 'soundmanager2';

export class PlayStore {
  @observable trackId;

  constructor() {
    this.sound = null;
  }

  toggle(trackId, mediaFile) {
    const lastTrackId = this.trackId;
    this.stopSong();

    // If different song, play it
    if(trackId !== lastTrackId && trackId !== this.trackId) {
      this.sound = soundManager.createSound({ url: mediaFile, volume: 80, onfinish: this.stopSong });
      this.sound.play();

      this.playing = true;
      this.trackId = trackId;
    }
  }

  stopSong = () => {
    // Stop the song, reset the state
    if(this.sound !== null) {
      this.sound.stop();
      this.sound.onfinish = false; // unbind event handler, just in-cae
      this.sound = null;

      this.trackId = null;
    }
  }
}

export default PlayStore;
