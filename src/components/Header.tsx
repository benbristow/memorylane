import React from 'react';
import { observer } from 'mobx-react-lite';
import DataStore from '../stores/DataStore';

interface HeaderProps {
  store: DataStore;
}

const Header: React.FC<HeaderProps> = observer(({ store }) => {
  const { playStore } = store;
  const activeTrack = playStore.activeTrack;

  return (
    <header className="text-center text-light mb-3">
      <h1 className="mb-2">Memory Lane - {store.year}</h1>

      {playStore.trackId && activeTrack && (
        <div className="now-playing-banner mx-auto d-flex align-items-center justify-content-between shadow">
          <div className="d-flex align-items-center overflow-hidden min-w-0 flex-grow-1">
            <div className="now-playing-art-wrapper position-relative flex-shrink-0">
              <img
                src={activeTrack.image}
                alt={activeTrack.title}
                className="now-playing-img"
              />
              {playStore.playing && (
                <div className="now-playing-pulse-indicator" />
              )}
            </div>
            <div className="now-playing-info text-start min-w-0 flex-grow-1">
              <div className="now-playing-header-line">
                <span className="now-playing-badge">PLAYING</span>
                <span className="now-playing-title text-truncate text-white" title={activeTrack.title}>
                  {activeTrack.title}
                </span>
              </div>
              <div className="now-playing-artist text-truncate" title={activeTrack.artist}>
                {activeTrack.artist}
              </div>
            </div>
          </div>

          <div className="now-playing-actions d-flex align-items-center flex-shrink-0">
            <button
              type="button"
              className={`btn btn-sm ${playStore.playing ? 'btn-warning text-dark' : 'btn-primary'} now-playing-btn now-playing-play-btn`}
              onClick={playStore.togglePause}
              title={playStore.playing ? 'Pause' : 'Play'}
            >
              {playStore.playing ? '❚❚' : '▶'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger now-playing-btn now-playing-stop-btn"
              onClick={playStore.stopSong}
              title="Stop"
            >
              ■
            </button>
          </div>
        </div>
      )}
    </header>
  );
});

export default Header;
