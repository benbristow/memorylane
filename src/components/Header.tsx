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
        <div className="now-playing-banner mx-auto d-flex align-items-center justify-content-between p-2 px-3 rounded shadow">
          <div className="d-flex align-items-center overflow-hidden me-3">
            <div className="now-playing-art-wrapper me-2 position-relative flex-shrink-0">
              <img
                src={activeTrack.image}
                alt={activeTrack.title}
                className="rounded now-playing-img"
              />
              {playStore.playing && (
                <div className="now-playing-pulse-indicator" />
              )}
            </div>
            <div className="text-start text-truncate">
              <div className="text-white fw-bold small text-truncate d-flex align-items-center gap-1">
                <span className="badge bg-success small py-0 px-1">PLAYING</span>
                <span title={activeTrack.title}>{activeTrack.title}</span>
              </div>
              <div className="text-muted small text-truncate" title={activeTrack.artist}>
                {activeTrack.artist}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className={`btn btn-sm ${playStore.playing ? 'btn-outline-warning' : 'btn-success'} now-playing-btn`}
              onClick={playStore.togglePause}
              title={playStore.playing ? 'Pause' : 'Play'}
            >
              {playStore.playing ? '❚❚' : '►'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger now-playing-btn"
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
