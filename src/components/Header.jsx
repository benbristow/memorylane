import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
class Header extends Component {
  render() {
    return (
      <header className="text-center text-light">
        <h1>
          Memory Lane - {this.props.store.year}
        </h1>
      </header>
    )
  }
}

Header.propTypes = {
  store: PropTypes.object.isRequired
}

export default Header;
