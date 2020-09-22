import SpotifyWebApi = require("spotify-web-api-node");

import { ITracksProvider } from "../../contracts/ITracksProvider";
import { ITrack } from "../../models/ITrack";

const spotifyWebApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

export class Spotify implements ITracksProvider {
  async getTracksForYear(year: number): Promise<ITrack[]> {
    const credentials = await spotifyWebApi.clientCredentialsGrant();
    spotifyWebApi.setAccessToken(credentials.body.access_token);

    const response = await spotifyWebApi.searchTracks(`year:${year}`);

    return response.body.tracks.items.map(x => ({
      artist: x.artists.map(y => y.name).join(' '),
      title: x.name,
      id: x.id,
      image: x.album.images[0].url,
      preview: x.preview_url
    }) as ITrack);
  }
}