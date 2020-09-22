import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { PulseLoader } from 'react-spinners';

import SpotifyTrack from './SpotifyTrack';
import Movie from './Movie';

@observer
class MediaGrid extends Component {
  render() {
    const { store, category } = this.props;

    if(store.loading) {
      return (
        <div className="text-center py-3">
          <PulseLoader
            color={'#FFF'}
            loading
          />
        </div>
      );
    }

    if(store.data && store.data[category] && store.data[category].length) {
      let media = [];

      if(category === 'tracks') {
        media = store.data[category].map(result => <SpotifyTrack key={result.id} store={store} data={result} />);
      }

      if(category === 'movies') {
        media = store.data[category].map(result => <Movie key={result.id} data={result} />);
      }

      if(media.length) {
        return(
          <div className="row">
            {media}
          </div>
        );
      }
    }

    return (
      <div className="alert alert-danger">
        No media found.
      </div>
    );
  }
}

MediaGrid.propTypes = {
  store: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired
}

export default MediaGrid;
