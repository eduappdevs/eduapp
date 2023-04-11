if Rails.env == 'production'
    Rails.application.config.session_store :cookie_store, key: '_authentication_app', domain:'example.example.com'
else
    Rails.application.config.session_store :cookie_store, key: '_authentication_app' , domain:ENV.fetch('REACT_APP_FRONTEND_ENDPOINT')
end

