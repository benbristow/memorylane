import React, { useState } from 'react';
import SpotifyPlayToggle from './SpotifyPlayToggle';
import DataStore from '../stores/DataStore';
import { Track } from '../types';

interface SpotifyTrackProps {
  store: DataStore;
  data: Track;
}

const TRACK_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a1e21"/><g opacity="0.25" transform="translate(140,130)"><path d="M48 8 L120 8 L120 80 L96 80 C96 93 85 104 72 104 C59 104 48 93 48 80 C48 67 59 56 72 56 L96 56 L96 32 L48 32 Z" fill="%23aaa"/></g><text x="200" y="290" text-anchor="middle" font-family="sans-serif" font-size="13" fill="%23666">No image available</text></svg>';

const SpotifyTrack: React.FC<SpotifyTrackProps> = ({ store, data }) => {
  const [imgSrc, setImgSrc] = useState(data.image || TRACK_PLACEHOLDER);
  return (
    <div className="col-xl-3 col-lg-6 mb-3 d-flex">
      <article className="card media-card h-100 w-100">
        <div className="media-card-img-wrapper track-img-wrapper">
          <img
            src={imgSrc}
            className="card-img-top"
            alt={data.title}
            loading="lazy"
            onError={() => setImgSrc(TRACK_PLACEHOLDER)}
          />
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
              trackData={data}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default SpotifyTrack;
