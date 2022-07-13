Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("REACT_APP_FRONTEND_ENDPOINT"), ENV.fetch("REACT_APP_ADMIN_ENDPOINT")

    resource "*",
             headers: :any,
             expose: [],
             methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
