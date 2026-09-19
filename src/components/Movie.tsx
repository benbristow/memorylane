import React from 'react';
import { Movie as MovieType } from '../types';

interface MovieProps {
  data: MovieType;
}

const Movie: React.FC<MovieProps> = ({ data }) => {
  const tmdbUrl = `https://www.themoviedb.org/movie/${data.id}`;
  const releaseYear = data.date ? new Date(data.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';

  return (
    <div className="col-xl-3 col-lg-6 mb-3 d-flex">
      <article className="card media-card h-100 w-100">
        <a
          href={tmdbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="media-card-img-wrapper movie-img-wrapper text-decoration-none"
        >
          <img src={data.image} className="card-img-top" alt={data.title} loading="lazy" />
        </a>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate-2" title={data.title}>
            <a
              href={tmdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-decoration-none hover-primary"
            >
              {data.title}
            </a>
          </h5>
          {releaseYear && (
            <div className="card-subtitle text-truncate mb-2 text-muted small">
              Released: {releaseYear}
            </div>
          )}
          <div className="mt-auto pt-2">
            <a
              href={tmdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-block btn-outline-info w-100 d-flex align-items-center justify-content-center gap-1"
            >
              <span>View Details</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Movie;
