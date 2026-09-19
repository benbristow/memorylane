import React from 'react';
import { observer } from 'mobx-react-lite';
import { PulseLoader } from 'react-spinners';
import SpotifyTrack from './SpotifyTrack';
import Movie from './Movie';
import DataStore from '../stores/DataStore';

interface MediaGridProps {
  store: DataStore;
  category: 'tracks' | 'movies';
}

const MediaGrid: React.FC<MediaGridProps> = observer(({ store, category }) => {
  if (store.loading) {
    const skeletonItems = Array.from({ length: 4 });
    const isTracks = category === 'tracks';

    return (
      <div>
        <div className="loading-indicator">
          <PulseLoader color={'#4C9DD5'} size={8} loading />
          <span>Loading {category}...</span>
        </div>
        <div className="row">
          {skeletonItems.map((_, index) => (
            <div key={index} className="col-xl-3 col-lg-6 mb-3">
              <div className="skeleton-card">
                <div className={`skeleton-shimmer ${isTracks ? 'skeleton-image' : 'skeleton-image-movie'}`} />
                <div className="skeleton-body">
                  <div className="skeleton-title skeleton-shimmer" />
                  {isTracks && <div className="skeleton-subtitle skeleton-shimmer" />}
                  {isTracks && <div className="skeleton-button skeleton-shimmer" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = store.data[category];

  if (items && items.length > 0) {
    return (
      <div className="row">
        {category === 'tracks'
          ? (items as any[]).map((track) => (
              <SpotifyTrack key={track.id} store={store} data={track} />
            ))
          : (items as any[]).map((movie) => (
              <Movie key={movie.id} data={movie} />
            ))}
      </div>
    );
  }

  return <div className="alert alert-danger">No media found.</div>;
});

export default MediaGrid;
