import React from 'react';
import { Movie as MovieType } from '../types';

interface MovieProps {
  data: MovieType;
}

const Movie: React.FC<MovieProps> = ({ data }) => {
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
};

export default Movie;
