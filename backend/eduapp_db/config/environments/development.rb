require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join("tmp", "caching-dev.txt").exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      "Cache-Control" => "public, max-age=#{2.days.to_i}",
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  config.hosts << ENV.fetch("DOMAIN")

  # config.host_authorization = {"4a0c-2a0c-5a80-1605-7300-4a5e-3126-a6ef-a3eb.ngrok.io"}

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # Action Cable Config (FMV)
  # config.action_cable.url = "wss://#{ENV.fetch("DOMAIN")}/chat"
  # config.action_cable.allowed_request_origins = [ENV.fetch("REACT_APP_FRONTEND_ENDPOINT"), ENV.fetch("REACT_APP_ADMIN_ENDPOINT")]
  config.action_cable.disable_request_forgery_protection = true

  config.action_mailer.delivery_method = :smtp

  #Production
  # config.action_mailer.default_url_options = { host: host }

  #Development
  config.action_mailer.default_url_options = { host: "#{ENV.fetch("HOST")}:#{ENV.fetch("PORT")}", protocol: "http" }
  config.action_mailer.smtp_settings = {
    address: ENV.fetch("SMTP_ADDRESS"),
    port: ENV.fetch("SMTP_PORT"),
    user_name: ENV.fetch("GMAIL_USERNAME"),
    password: ENV.fetch("GMAIL_PASSWORD"),
    authentication: "plain",
    enable_starttls_auto: true,
    open_timeout: 5,
    read_timeout: 5,
  }
end
