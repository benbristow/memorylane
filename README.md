# Memory Lane ⏳🎶🎬

**Memory Lane** is a nostalgic web application that lets you take a trip down memory lane. Pick any year from 1925 to the present day using the interactive slider to discover the popular songs and movies from that year, complete with 30-second audio track previews and movie posters.

---

## 🚀 Features

- **Interactive Timeline Slider**: Smooth slider allowing exploration from 1925 to present day.
- **Top Songs & Audio Previews**: Fetches top tracks for the selected year via the Apple iTunes Search API, with instant in-browser 30-second audio playback.
- **Box Office & Notable Movies**: Fetches notable movie releases for the year via TheMovieDB (TMDB) API.
- **Optimized Caching**:
  - Client-side in-memory caching for instant tab/year toggling without redundant requests.
  - Azure Static Web Apps edge & browser `Cache-Control` (`public, max-age=86400, s-maxage=86400`) configured via `staticwebapp.config.json` and API headers.
- **Modern Loading UI**: Animated skeleton card placeholders with shimmer effects and pulse spinners while fetching media.

---

## 🛠 Tech Stack

- **Frontend**:
  - React 18 & TypeScript
  - Vite (Fast ESM development & production bundler)
  - MobX 6 & `mobx-react-lite` for reactive state management
  - Bootstrap 4 & SASS / SCSS (Dart Sass)
  - `rc-slider` for year selection
  - SoundManager2 for audio preview playback
  - `react-spinners`
- **Backend API**:
  - Azure Functions v4 (.NET 10.0 isolated worker with ASP.NET Core integration)
  - TheMovieDB API for film data
  - iTunes Search API for music tracks and audio clips
  - Azure Static Web Apps CI/CD (`.github/workflows/`)

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) & `npm`
- A free [TheMovieDB API Key](https://www.themoviedb.org/documentation/api)
- *(Optional for running the .NET Functions host directly)*: [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) & [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) (`func`)

---

### Local Development (Recommended)

1. **Configure your TMDB API Key**:
   In `api/local.settings.json` (or copied from `api/local.settings.json.example`):
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "dotnet",
       "THEMOVIEDB_API_KEY": "your_themoviedb_api_key_here"
     }
   }
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm start
   ```
   Open `http://localhost:3000`. Vite includes built-in API dev middleware for `/api/GetYear`, so the frontend works immediately without needing to run a separate backend process!

---

### Running with Azure Functions Host (Optional)

If you wish to test the .NET Azure Function directly:

1. In the `api/` directory, start the functions host:
   ```bash
   cd api
   func start
   ```
   The API will listen on `http://localhost:7071`.

2. Build or test the .NET project:
   ```bash
   dotnet build
   ```

---

## 🚢 Deployment

The project is configured for continuous deployment with **Azure Static Web Apps**:
- Pushes to `master` trigger the GitHub Actions workflow [`.github/workflows/azure-static-web-apps-zealous-wave-00506ad03.yml`](.github/workflows/azure-static-web-apps-zealous-wave-00506ad03.yml).
- App build output: `build`
- API location: `api`
- Make sure to set `THEMOVIEDB_API_KEY` in your Azure Static Web App's **Configuration / Application Settings**.
