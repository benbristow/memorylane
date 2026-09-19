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
          <div className="loading-indicator mb-3">
            <PulseLoader color={'#4C9DD5'} size={8} loading />
            <span>Loading movies and music for {store.year}...</span>
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
