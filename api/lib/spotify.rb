# frozen_string_literal: true

class Spotify
  def initialize
    RSpotify.authenticate(ENV['SPOTIFY_CLIENT_ID'], ENV['SPOTIFY_CLIENT_SECRET'])
  end

  def top_tracks_by_year(year)
    RSpotify::Track.search("year:#{year}").map { |track| format_track(track) }
  end

  private

  def format_track(track)
    {
      id: track.id,
      artist: track.artists.map(&:name).join(', '),
      title: track.name,
      image: track.album.images.max_by { |image| image['height'] }['url'],
      preview: track.preview_url
    }
  end
end
