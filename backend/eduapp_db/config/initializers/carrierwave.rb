CarrierWave.configure do |config|
  config.asset_host = "http://#{ENV.fetch("DB_HOST")}:#{ENV.fetch("PORT")}"
end
