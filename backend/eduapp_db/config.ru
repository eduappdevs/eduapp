# This file is used by Rack-based servers to start the application.

require_relative "config/environment"

map "/api/#{ENV.fetch("API_VERSION")}" do
  run Rails.application
  Rails.application.load_server
end
