import { makeAutoObservable } from 'mobx';
import { soundManager } from 'soundmanager2';
import { Track } from '../types';

export class PlayStore {
  trackId: string | null = null;
  activeTrack: Track | null = null;
  sound: soundmanager.SMSound | null = null;
  playing: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  toggle(trackId: string, mediaFile?: string, trackData?: Track): void {
    const lastTrackId = this.trackId;
    this.stopSong();

    // If different song, play it
    if (trackId !== lastTrackId && mediaFile) {
      this.sound = soundManager.createSound({
        id: `sound_${trackId}`,
        url: mediaFile,
        volume: 80,
        onfinish: this.stopSong
      });
      this.sound?.play();

      this.playing = true;
      this.trackId = trackId;
      this.activeTrack = trackData ?? null;
    }
  }

  togglePause(): void {
    if (this.sound) {
      if (this.playing) {
        this.sound.pause();
        this.playing = false;
      } else {
        this.sound.resume();
        this.playing = true;
      }
    }
  }

  stopSong(): void {
    if (this.sound !== null) {
      this.sound.stop();
      this.sound = null;
      this.playing = false;
      this.trackId = null;
      this.activeTrack = null;
    }
  }
}

export default PlayStore;
