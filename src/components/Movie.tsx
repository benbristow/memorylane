import React from 'react';
import { Movie as MovieType } from '../types';

interface MovieProps {
  data: MovieType;
}

const Movie: React.FC<MovieProps> = ({ data }) => {
  return (
    <div className="col-xl-3 col-lg-6 mb-3 d-flex">
      <article className="card media-card h-100 w-100">
        <div className="media-card-img-wrapper movie-img-wrapper">
          <img src={data.image} className="card-img-top" alt={data.title} loading="lazy" />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate-2" title={data.title}>{data.title}</h5>
        </div>
      </article>
    </div>
  );
};

export default Movie;
