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
  get "#{@api_path}/filter/tuitions", to: "tuitions#filter"
  get "#{@api_path}/filter/teachers", to: "user_infos#teacher_filter"
  get "#{@api_path}/filter/roles", to: "user_roles#filter"
  get "#{@api_path}/filter/chats", to: "chat_bases#filter"
  get "#{@api_path}/filter/chat_participants", to: "chat_participants#filter"

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
  delete "#{@api_path}/user_infos/remove_global_events/:user_id", to: "user_infos#remove_event"
  get "#{@api_path}/calendar_annotations/:user_id/event_pop", to: "calendar_annotations#show_calendar_event"
  get "#{@api_path}/calendar_annotations/:user_id/all", to: "calendar_annotations#calendar_info"

  devise_for :users,
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations",
             }, defaults: { format: :json }
  devise_scope :user do
    match "#{@api_path}/users/sign_in" => "users/sessions#new", via: [:get]
    match "#{@api_path}/users/sign_in" => "users/sessions#create", via: [:post]
    match "#{@api_path}/users/sign_out" => "users/sessions#destroy", via: [:delete]

    match "#{@api_path}/users/password/new" => "devise/passwords#new", via: [:get]
    match "#{@api_path}/users/password/edit" => "devise/passwords#edit", via: [:get]
    match "#{@api_path}/users/password" => "devise/passwords#update", via: [:patch, :put]
    match "#{@api_path}/users/password" => "devise/passwords#create", via: [:post]

    match "#{@api_path}/users/cancel" => "users/registrations#cancel", via: [:get]
    match "#{@api_path}/users/sign_up" => "users/registrations#new", via: [:get]
    match "#{@api_path}/users/edit" => "users/registrations#edit", via: [:get]
    match "#{@api_path}/users/edit" => "users/registrations#edit_user", via: [:put]
    match "#{@api_path}/users" => "users/registrations#update", via: [:patch, :put]
    match "#{@api_path}/users" => "users/registrations#destroy", via: [:delete]
    match "#{@api_path}/users" => "users/registrations#create", via: [:post]

    match "#{@api_path}/glogin/link" => "users/sessions#glogin_link", via: [:post]
    match "#{@api_path}/glogin/unlink" => "users/sessions#glogin_unlink", via: [:post]
    match "#{@api_path}/glogin/login" => "users/sessions#glogin_login", via: [:post]

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

  get "#{@api_path}/ping", to: "static#ping"
  get "#{@api_path}/ping/admin", to: "static#admin"
  get "#{@api_path}/ping/created", to: "static#created"
end
