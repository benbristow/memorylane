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

          const currentYear = new Date().getFullYear();

          const junkKeywords = [
            'bgm', 'cafe', 'cafes', 'cover', 'karaoke', 'tribute',
            'relaxing', 'lo-fi', 'lofi', 'instrumental', 'lullaby',
            'workout', 'meditation', 'sleep', 'ballermann', 'schützenfest', 'remake'
          ];

          const isJunk = (artist: string, title: string, collection = '') => {
            const a = (artist || '').toLowerCase();
            const t = (title || '').toLowerCase();
            const c = (collection || '').toLowerCase();
            return junkKeywords.some((k) => a.includes(k) || t.includes(k) || c.includes(k));
          };

          const fetchChartTracks = async () => {
            const [gbRes, usRes] = await Promise.all([
              axios.get('https://itunes.apple.com/gb/rss/topsongs/limit=100/json').catch(() => null),
              axios.get('https://itunes.apple.com/us/rss/topsongs/limit=100/json').catch(() => null)
            ]);

            const rawEntries = [
              ...(gbRes?.data?.feed?.entry || []),
              ...(usRes?.data?.feed?.entry || [])
            ];

            const parsed: Array<{ track: any; releaseDate: string }> = [];
            const seen = new Set<string>();

            for (const entry of rawEntries) {
              const title = entry['im:name']?.label || '';
              const artist = entry['im:artist']?.label || '';
              const id = entry['id']?.attributes?.['im:id'] || '';
              const releaseDate = entry['im:releaseDate']?.label || '';

              const images = entry['im:image'] || [];
              const rawImage = images.length ? images[images.length - 1].label : '';
              const image = rawImage.replace(/\/\d+x\d+bb/, '/600x600bb');

              const links = Array.isArray(entry['link']) ? entry['link'] : [entry['link']];
              const previewLink = links.find(
                (l: any) => l?.attributes?.rel === 'enclosure' || l?.['im:assetType'] === 'preview'
              );
              const preview = previewLink?.attributes?.href || '';

              if (!title || !artist || !preview || !image) continue;
              if (isJunk(artist, title)) continue;

              const key = `${artist.trim().toLowerCase()}|${title.trim().toLowerCase()}`;
              if (seen.has(key)) continue;
              seen.add(key);

              parsed.push({
                track: {
                  artist,
                  id,
                  image,
                  preview,
                  title
                },
                releaseDate
              });
            }

            const yearStr = year.toString();
            parsed.sort((a, b) => {
              const aCurrent = a.releaseDate.startsWith(yearStr) ? 1 : 0;
              const bCurrent = b.releaseDate.startsWith(yearStr) ? 1 : 0;
              return bCurrent - aCurrent;
            });

            return parsed.map((p) => p.track);
          };

          const tracksPromise = (async () => {
            if (year >= currentYear) {
              const chartTracks = await fetchChartTracks();
              if (chartTracks.length > 0) {
                return chartTracks;
              }
            }

            const [r1, r2, r3, r4] = await Promise.all([
              fetchTracks(`${year} hits`),
              fetchTracks(year.toString()),
              fetchTracks(`top hits ${year}`),
              fetchTracks(`${year} album`)
            ]);

            const rawTracks = [...r1, ...r2, ...r3, ...r4].filter(
              (t: any) =>
                t.previewUrl &&
                t.artworkUrl100 &&
                !isJunk(t.artistName, t.trackName, t.collectionName)
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
          })();

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
