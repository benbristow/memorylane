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
          const fetchTracks = (term: string) =>
            axios
              .get(`https://itunes.apple.com/search`, {
                params: {
                  term,
                  entity: 'song',
                  limit: 200,
                  country: 'gb'
                }
              })
              .then((r) => r.data?.results || [])
              .catch(() => []);

          const tracksPromise = Promise.all([
            fetchTracks(`${year} hits`),
            fetchTracks(year.toString()),
            fetchTracks(`top hits ${year}`),
            fetchTracks(`${year} album`)
          ]).then(([r1, r2, r3, r4]) => {
            const junkKeywords = [
              'bgm', 'cafe', 'cafes', 'cover', 'karaoke', 'tribute',
              'relaxing', 'lo-fi', 'lofi', 'instrumental', 'lullaby',
              'workout', 'meditation', 'sleep', 'ballermann', 'schützenfest', 'remake'
            ];

            const isJunk = (t: any) => {
              const artist = (t.artistName || '').toLowerCase();
              const title = (t.trackName || '').toLowerCase();
              const collection = (t.collectionName || '').toLowerCase();
              return junkKeywords.some(
                (k) => artist.includes(k) || title.includes(k) || collection.includes(k)
              );
            };

            const rawTracks = [...r1, ...r2, ...r3, ...r4].filter(
              (t: any) => t.previewUrl && t.artworkUrl100 && !isJunk(t)
            );
            const yearStr = year.toString();

            // Strictly filter to tracks released in that year
            const exact = rawTracks.filter(
              (t: any) => t.releaseDate && t.releaseDate.startsWith(yearStr)
            );

            // Deduplicate by artist and track name
            const seen = new Set();
            let finalTracks = exact.filter((t: any) => {
              const key = `${t.artistName?.trim().toLowerCase()}|${t.trackName?.trim().toLowerCase()}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });

            if (!finalTracks.length) {
              finalTracks = rawTracks
                .filter(
                  (t: any) =>
                    t.collectionName &&
                    t.collectionName.includes(yearStr) &&
                    t.releaseDate &&
                    Math.abs(new Date(t.releaseDate).getFullYear() - year) <= 1
                )
                .filter((t: any) => {
                  const key = `${t.artistName?.trim().toLowerCase()}|${t.trackName?.trim().toLowerCase()}`;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
            }

            return finalTracks.map((t: any) => ({
              artist: t.artistName || '',
              id: t.trackId?.toString() || '',
              image: (t.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
              preview: t.previewUrl || '',
              title: t.trackName || ''
            }));
          });

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
