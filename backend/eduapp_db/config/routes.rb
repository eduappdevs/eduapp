Rails.application.routes.draw do
  @api_path = "/api/#{ENV.fetch("API_VERSION")}"

  default_url_options :host => @api_path
  mount ActionCable.server => "#{@api_path}/websocket"

  resources :user_roles, :path => "#{@api_path}/user_roles"
  resources :chat_messages, :path => "#{@api_path}/chat_messages"
  resources :chat_participants, :path => "#{@api_path}/chat_participants"
  resources :chat_base_infos, :path => "#{@api_path}/chat_base_infos"
  resources :chat_bases, :path => "#{@api_path}/chat_bases"
  resources :subjects, :path => "#{@api_path}/subjects"
  resources :calendar_annotations, :path => "#{@api_path}/calendar_annotations"
  resources :tuitions, :path => "#{@api_path}/tuitions"
  resources :courses, :path => "#{@api_path}/courses"
  resources :institutions, :path => "#{@api_path}/institutions"
  resources :resources, :path => "#{@api_path}/resources"
  resources :eduapp_user_sessions, :path => "#{@api_path}/eduapp_user_sessions"
  resources :user_infos, :path => "#{@api_path}/user_infos"

  get "#{@api_path}/filter/user_infos", to: "user_infos#filter"
  get "#{@api_path}/filter/courses", to: "courses#filter"
  get "#{@api_path}/filter/subjects", to: "subjects#filter"
  get "#{@api_path}/filter/resources", to: "resources#filter"
  get "#{@api_path}/filter/sessions", to: "eduapp_user_sessions#filter"
  get "#{@api_path}/filter/events", to: "calendar_annotations#filter"

  delete "#{@api_path}/chat_participants/remove/:user_id/:chat_base_id", to: "chat_participants#remove_participant"

  post "#{@api_path}/eduapp_user_sessions/batch_load", to: "eduapp_user_sessions#session_batch_load"
  delete "#{@api_path}/eduapp_user_sessions/batch_delete/:batch_id", to: "eduapp_user_sessions#destroy_batch"
  put "#{@api_path}/eduapp_user_sessions/batch_update/:batch_id", to: "eduapp_user_sessions#update_batch"

  get "#{@api_path}/system/chat/notifications", to: "chat_bases#has_system_notifs"
  get "#{@api_path}/system/user/", to: "user_infos#system_user"

  post "#{@api_path}/user_infos/add_subject/:user_id/:subject_id", to: "user_infos#add_subject"
  delete "#{@api_path}/user_infos/remove_subject/:user_id/:subject_id", to: "user_infos#remove_subject"

  post "#{@api_path}/user_infos/global_events/:user_id", to: "user_infos#add_events"
  delete "#{@api_path}/user_infos/remove_global_events/:user_id/:calendar_event", to: "user_infos#remove_event"
  get "#{@api_path}/calendar_annotations/all_id", to: "calendar_annotations#calendar_info"

  devise_for :users,
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations",
               omniauth_callbacks: "users/omniauth_callbacks",
             }, defaults: { format: :json }
  devise_scope :user do
    match "#{@api_path}/users/sign_in" => "users/sessions#new", via: [:get]
    match "#{@api_path}/users/sign_in" => "users/sessions#create", via: [:post]
    match "#{@api_path}/users/sign_out" => "users/sessions#destroy", via: [:delete]

    match "#{@api_path}/users/auth/google_oauth2" => "users/omniauth_callbacks#passthru", via: [:get, :post]
    match "#{@api_path}/users/auth/google_oauth2/callback" => "users/omniauth_callbacks#google_oauth2", via: [:get, :post]

    match "#{@api_path}/users/password/new" => "devise/passwords#new", via: [:get]
    match "#{@api_path}/users/password/edit" => "devise/passwords#edit", via: [:get]
    match "#{@api_path}/users/password" => "devise/passwords#update", via: [:patch, :put]
    match "#{@api_path}/users/password" => "devise/passwords#create", via: [:post]

    match "#{@api_path}/users/cancel" => "users/registrations#cancel", via: [:get]
    match "#{@api_path}/users/sign_up" => "users/registrations#new", via: [:get]
    match "#{@api_path}/users/edit" => "users/registrations#edit", via: [:get]
    match "#{@api_path}/users/edit" => "users/registrations#edit", via: [:get]
    match "#{@api_path}/users" => "users/registrations#update", via: [:patch, :put]
    match "#{@api_path}/users" => "users/registrations#destroy", via: [:delete]
    match "#{@api_path}/users" => "users/registrations#create", via: [:post]

    get "#{@api_path}/password/reset", to: "users/passwords#get_reset_password_token"
    get "#{@api_path}/reset_password", to: "users/passwords#send_reset_password_link"
    post "#{@api_path}/password/reset", to: "users/passwords#do_reset_password"
    get "#{@api_path}/send_change_password_instructions", to: "users/passwords#send_change_password_instructions"
    get "#{@api_path}/change_password_with_code", to: "users/passwords#change_password"
    get "#{@api_path}/extrafields/:table/:id", to: "application#get_extrafields"
    post "#{@api_path}/extrafields/:table/:id", to: "application#push_extrafields"
    put "#{@api_path}/extrafields/:table/:id", to: "application#update_extrafield"
    delete "#{@api_path}/extrafields/:table/:id/:field", to: "application#delete_extrafield"
  end

  delete "#{@api_path}/users/remove/:id", to: "user_infos#destroyuser"
  get "#{@api_path}/google-login", to: "glogin#login"
  get "#{@api_path}/ping", to: "static#home"
  get "#{@api_path}/ping/admin", to: "static#created"
end
