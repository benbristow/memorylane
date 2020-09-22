import React, { Component } from 'react'
import PropTypes from 'prop-types';

class Movie extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className="col-xl-3 col-lg-6 mb-3">
        <article className="card">
          <img src={data.image} className="card-img-top" alt={data.title} />
          <div className="card-body">
            <h5 className="card-title">{data.title}</h5>
          </div>
        </article>
      </div>
    );
  }
}

Movie.propTypes = {
  data: PropTypes.object.isRequired
}

export default Movie;
