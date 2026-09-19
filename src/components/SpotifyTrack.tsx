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
    <div className="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-3 d-flex">
      <article className="card media-card h-100 w-100">
        <div className="media-card-img-wrapper track-img-wrapper">
          <img src={data.image} className="card-img-top" alt={data.title} loading="lazy" />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate-2" title={data.title}>{data.title}</h5>
          <div className="card-subtitle text-truncate mb-2 text-muted small" title={data.artist}>
            {data.artist}
          </div>
          <div className="mt-auto pt-2">
            <SpotifyPlayToggle
              store={store.playStore}
              trackId={data.id}
              mediaFile={data.preview}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default SpotifyTrack;
