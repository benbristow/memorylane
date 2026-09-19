import React from 'react';
import PlayStore from '../stores/PlayStore';
import { observer } from 'mobx-react-lite';

import { Track } from '../types';

interface SpotifyPlayToggleProps {
  store: PlayStore;
  trackId: string;
  mediaFile?: string;
  trackData?: Track;
}

const SpotifyPlayToggle: React.FC<SpotifyPlayToggleProps> = observer(({ store, trackId, mediaFile, trackData }) => {
  const togglePlayback = () => {
    store.toggle(trackId, mediaFile, trackData);
  };

  const playing = store.trackId === trackId;
  const buttonClasses = ['btn', 'btn-sm', 'btn-block', playing ? 'btn-success' : 'btn-dark'].join(' ');

  if (!mediaFile) {
    return null;
  }

  return (
    <button className={buttonClasses} onClick={togglePlayback} type="button">
      {playing ? '■' : '►'}
    </button>
  );
});

export default SpotifyPlayToggle;
