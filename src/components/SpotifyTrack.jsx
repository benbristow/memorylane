import React, { Component } from 'react'
import PropTypes from 'prop-types';

import SpotifyPlayToggle from './SpotifyPlayToggle';

class SpotifyTrack extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className="col-xl-3 col-lg-6 mb-3">
        <article className="card">
          <img src={data.image} className="card-img-top" alt={data.title} />
          <div className="card-body">
            <h5 className="card-title">
              {data.title}
            </h5>
            <div className="mb-1">
              {data.artist}
            </div>
            <SpotifyPlayToggle
              store={this.props.store.playStore}
              trackId={data.id}
              mediaFile={data.preview} />
          </div>
        </article>
      </div>
    );
  }
}

SpotifyTrack.propTypes = {
  data: PropTypes.object.isRequired
}

export default SpotifyTrack;
