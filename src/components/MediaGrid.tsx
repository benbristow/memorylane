import React from 'react';
import { observer } from 'mobx-react-lite';
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
      <div className="row">
        {skeletonItems.map((_, index) => (
          <div key={index} className="col-xl-3 col-lg-6 mb-3 d-flex">
            <div className="skeleton-card media-card h-100 w-100 d-flex flex-column">
              <div className={`skeleton-shimmer ${isTracks ? 'skeleton-image' : 'skeleton-image-movie'}`} />
              <div className="skeleton-body d-flex flex-column flex-grow-1">
                <div className="skeleton-title skeleton-shimmer" />
                {isTracks && <div className="skeleton-subtitle skeleton-shimmer" />}
                {isTracks && <div className="skeleton-button skeleton-shimmer mt-auto" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = store.data[category];
  const moviesCount = store.data.movies?.length ?? 0;
  const displayItems =
    category === 'tracks' && moviesCount > 0
      ? (items as any[])?.slice(0, moviesCount)
      : (items as any[]);

  if (displayItems && displayItems.length > 0) {
    return (
      <div className="row">
        {category === 'tracks'
          ? displayItems.map((track) => (
              <SpotifyTrack key={track.id} store={store} data={track} />
            ))
          : displayItems.map((movie) => (
              <Movie key={movie.id} data={movie} />
            ))}
      </div>
    );
  }

  return <div className="alert alert-danger">No media found.</div>;
});

export default MediaGrid;
