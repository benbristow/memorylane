import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import DataStore from './stores/DataStore';
import Header from './components/Header';
import YearSlider from './components/YearSlider';
import MediaGrid from './components/MediaGrid';

const App: React.FC = observer(() => {
  const store = useMemo(() => new DataStore(), []);

  return (
    <div>
      <aside className="bg-secondary mb-4">
        <div className="container-fluid">
          <div className="p-2">
            <a
              className="text-white"
              href="https://ben.bristow.me/"
            >
              &larr; Back to ben.bristow.me
            </a>{' '}
          </div>
        </div>
      </aside>

      <main className="container-fluid">
        <Header store={store} />
        <YearSlider store={store} />

        <div className={`joint-loader-bar ${store.loading ? 'is-loading' : ''}`}>
          <div className="joint-loader-progress" />
          <div className="joint-loader-status">
            <div className="spinner-ring" />
            <span className="joint-loader-text">
              Loading {store.year} music & movies...
            </span>
          </div>
        </div>

        <section className="media-section mb-5">
          <div className="d-flex align-items-center mb-3 pb-2 border-bottom border-secondary">
            <h2 className="h4 text-light mb-0">Popular Songs</h2>
            <span className="badge bg-primary ms-2">Tracks</span>
          </div>
          <MediaGrid store={store} category="tracks" />
        </section>

        <section className="media-section mb-5">
          <div className="d-flex align-items-center mb-3 pb-2 border-bottom border-secondary">
            <h2 className="h4 text-light mb-0">Hit Movies</h2>
            <span className="badge bg-primary ms-2">Cinema</span>
          </div>
          <MediaGrid store={store} category="movies" />
        </section>
      </main>
    </div>
  );
});

export default App;
