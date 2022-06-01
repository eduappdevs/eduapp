Rails.application.routes.draw do
  default_url_options :host => "localhost:3000"
  mount ActionCable.server => "/chat"
  resources :user_roles
  resources :chat_messages
  resources :chat_participants
  resources :chat_base_infos
  resources :chat_bases
  resources :subjects
  resources :calendar_annotations
  resources :tuitions
  resources :courses
  resources :institutions
  resources :resources
  resources :eduapp_user_sessions
  resources :user_infos
  # get "calendar_annotations/index"
  post "eduapp_user_sessions/batch_load", to: "eduapp_user_sessions#session_batch_load"

  get "/system/chat/notifications", to: "chat_bases#has_system_notifs"
  get "/system/user/", to: "user_infos#system_user"

  post "/user_infos/add_subject/:user_id/:subject_id", to: "user_infos#add_subject"
  delete "/user_infos/remove_subject/:user_id/:subject_id", to: "user_infos#remove_subject"

  devise_for :users,
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations",
               omniauth_callbacks: "users/omniauth_callbacks",
             }, defaults: { format: :json }
  devise_scope :user do
    get "password/reset", to: "users/passwords#get_reset_password_token"
    get "reset_password", to: "users/passwords#send_reset_password_link"
    post "password/reset", to: "users/passwords#do_reset_password"
    get "send_change_password_instructions", to: "users/passwords#send_change_password_instructions"
    get "change_password_with_code", to: "users/passwords#change_password"
    get "add_extrafield", to: "application#add_extrafield"
    get "getExtrafields", to: "application#getExtrafields"
  end

  delete "/users/remove/:id", to: "user_infos#destroyuser"
  get "/google-login", to: "glogin#login"
  get "/ping", to: "static#home"
  get "/ping/admin", to: "static#created"
end
