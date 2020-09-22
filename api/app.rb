#!/usr/bin/env ruby
require 'rubygems'
require 'bundler'

Bundler.require(:default)
Bundler.require(:development) if development?

require_rel 'lib'

LockAndCache.lock_storage = Redis.new db: 3
LockAndCache.cache_storage = Redis.new db: 4

class MemoryLane < Sinatra::Base
  use Rack::PostBodyContentTypeParser

  configure do
    set :root_folder, File.dirname(__FILE__)
    set :public_folder, File.join(settings.root_folder, 'public')
  end

  configure :development do
    register Sinatra::Reloader
    also_reload File.join(settings.public_folder, 'lib/**/*.rb')
    Dotenv.load
  end

  get '/api/1.0/all' do
    current_year = Date.today.year
    year = params[:year] || current_year

    return json error('Year specified is in an invalid format') unless year =~ /^\d{4}$/
    return json error('Year is too old (must be older than 1925)') unless year.to_i > 1925
    return json error("Welcome, future traveller. You can't go this far.") if year.to_i > current_year

    response = cache(:all, year: year) do
      {
        meta: {
          criteria: {
            year: year
          }
        },
        results: {
          movies: TheMovieDB.new.top_movies_by_year(year),
          tracks: Spotify.new.top_tracks_by_year(year)
        }
      }
    end

    json response
  end

  get '/api/*' do
    json error('Invalid route')
  end

  get '/*' do
    send_file File.join(settings.public_folder, 'index.html')
  end

  private

  def error(message)
    status 422
    { success: false, errors: [message] }
  end

  def cache(name, params = {})
    return yield unless enable_cache?
    LockAndCache.lock_and_cache(name, params, expires: 1.month) { yield }
  end

  def enable_cache?
    Sinatra::Application.settings.production? || ENV['FORCE_CACHE'] == 'true'
  end
end
