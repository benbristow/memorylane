import React from 'react';
import { observer } from 'mobx-react-lite';
import DataStore from '../stores/DataStore';

interface HeaderProps {
  store: DataStore;
}

const Header: React.FC<HeaderProps> = observer(({ store }) => {
  return (
    <header className="text-center text-light">
      <h1>Memory Lane - {store.year}</h1>
    </header>
  );
});

export default Header;
