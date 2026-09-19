import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

function getTmdbApiKey(): string {
  try {
    const localSettingsPath = path.resolve(__dirname, 'api/local.settings.json');
    if (fs.existsSync(localSettingsPath)) {
      const raw = fs.readFileSync(localSettingsPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed?.Values?.THEMOVIEDB_API_KEY) {
        return parsed.Values.THEMOVIEDB_API_KEY;
      }
    }
  } catch (e) {
    // fallback
  }
  return process.env.THEMOVIEDB_API_KEY || '';
}

function localApiDevPlugin(): Plugin {
  return {
    name: 'local-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/GetYear')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const yearParam = urlObj.searchParams.get('year');
          const year = parseInt(yearParam || '', 10);

          if (isNaN(year) || year < 1925 || year > new Date().getFullYear()) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid year parameter' }));
            return;
          }

          const tmdbApiKey = getTmdbApiKey();

          // 1. Fetch movies from TheMovieDB
          const moviesPromise = axios
            .get(`https://api.themoviedb.org/3/discover/movie`, {
              params: {
                api_key: tmdbApiKey,
                primary_release_year: year,
                certification_country: 'gb'
              }
            })
            .then((r) =>
              (r.data?.results || []).map((m: any) => ({
                date: m.release_date || '',
                description: m.overview || '',
                id: m.id,
                image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
                title: m.title || ''
              }))
            )
            .catch(() => []);

          // 2. Fetch tracks from iTunes Search API
          const tracksPromise = axios
            .get(`https://itunes.apple.com/search`, {
              params: {
                term: year,
                entity: 'song',
                limit: 200,
                country: 'gb'
              }
            })
            .then((r) => {
              const rawTracks = (r.data?.results || []).filter(
                (t: any) => t.previewUrl && t.artworkUrl100
              );
              const yearStr = year.toString();

              const exact = rawTracks.filter(
                (t: any) => t.releaseDate && t.releaseDate.startsWith(yearStr)
              );
              const albumMatch = rawTracks.filter(
                (t: any) =>
                  !exact.includes(t) &&
                  t.collectionName &&
                  t.collectionName.includes(yearStr)
              );

              let combined = [...exact, ...albumMatch];
              if (!combined.length) {
                combined = rawTracks.slice(0, 20);
              }

              // Deduplicate
              const seen = new Set();
              const unique = combined.filter((t: any) => {
                if (seen.has(t.trackId)) return false;
                seen.add(t.trackId);
                return true;
              });

              return unique.map((t: any) => ({
                artist: t.artistName || '',
                id: t.trackId?.toString() || '',
                image: (t.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
                preview: t.previewUrl || '',
                title: t.trackName || ''
              }));
            })
            .catch(() => []);

          const [movies, tracks] = await Promise.all([moviesPromise, tracksPromise]);
          const limitedTracks = movies.length > 0 ? tracks.slice(0, movies.length) : tracks;

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              meta: { criteria: { year } },
              movies,
              tracks: limitedTracks
            })
          );
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiDevPlugin()],
  build: {
    outDir: 'build'
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'global-builtin',
          'color-functions',
          'if-function',
          'abs-percent'
        ]
      }
    }
  },
  server: {
    port: 3000
  }
});
