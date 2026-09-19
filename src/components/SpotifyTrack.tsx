import React from 'react';
import SpotifyPlayToggle from './SpotifyPlayToggle';
import DataStore from '../stores/DataStore';
import { Track } from '../types';

interface SpotifyTrackProps {
  store: DataStore;
  data: Track;
}

const SpotifyTrack: React.FC<SpotifyTrackProps> = ({ store, data }) => {
  return (
    <div className="col-xl-3 col-lg-6 mb-3">
      <article className="card">
        <img src={data.image} className="card-img-top" alt={data.title} />
        <div className="card-body">
          <h5 className="card-title">{data.title}</h5>
          <div className="mb-1">{data.artist}</div>
          <SpotifyPlayToggle
            store={store.playStore}
            trackId={data.id}
            mediaFile={data.preview}
          />
        </div>
      </article>
    </div>
  );
};

export default SpotifyTrack;
