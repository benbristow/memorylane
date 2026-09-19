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

        <div className="row">
          <div className="col-lg-6 mb-4">
            <MediaGrid store={store} category="tracks" />
          </div>
          <div className="col-lg-6 mb-4">
            <MediaGrid store={store} category="movies" />
          </div>
        </div>
      </main>
    </div>
  );
});

export default App;
