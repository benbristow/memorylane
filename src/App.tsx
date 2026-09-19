import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { PulseLoader } from 'react-spinners';
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

        {store.loading && (
          <div className="full-page-loader-overlay" role="dialog" aria-modal="true" aria-label="Loading">
            <div className="full-page-loader-content">
              <div className="loader-spinner">
                <PulseLoader color={'#4C9DD5'} size={14} loading />
              </div>
              <h2 className="loader-title">Loading Memory Lane</h2>
              <p className="loader-subtitle">Gathering songs and movies from {store.year}...</p>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-6">
            <MediaGrid store={store} category="tracks" />
          </div>
          <div className="col-lg-6">
            <MediaGrid store={store} category="movies" />
          </div>
        </div>
      </main>
    </div>
  );
});

export default App;
