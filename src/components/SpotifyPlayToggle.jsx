import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
class SpotifyPlayToggle extends Component {
  togglePlayback = () => {
    this.props.store.toggle(this.props.trackId, this.props.mediaFile);
  }

  render() {
    let buttonClasses = ['btn', 'btn-sm', 'btn-block'];

    const playing = this.props.store.trackId === this.props.trackId;
    buttonClasses.push(playing ? 'btn-success' : 'btn-dark');

    if(this.props.mediaFile) {
      return (
        <button
          className={buttonClasses.join(' ')}
          onClick={this.togglePlayback}>
          {playing ? '■' : '►'}
        </button>
      );
    }

    return null;
  }
}

SpotifyPlayToggle.propTypes = {
  store: PropTypes.object.isRequired,
  trackId: PropTypes.string.isRequired,
  mediaFile: PropTypes.string
}

export default SpotifyPlayToggle;
