Rails.application.routes.draw do
  mount ActionCable.server => "/chat"
  resources :chat_messages
  resources :chat_participants
  resources :chat_base_infos
  resources :chat_bases
  resources :subjects
  get "calendar_annotations/index"
  resources :calendar_annotations
  resources :tuitions
  resources :courses
  resources :institutions
  resources :resources
  resources :eduapp_user_sessions
  resources :user_infos
  get "/system/chat/notifications", to: "chat_bases#has_system_notifs"
  get "/system/user/", to: "user_infos#system_user"
  post "/user_infos/add_subject/:user_id/:subject_id", to: "user_infos#add_subject"
  delete "/user_infos/remove_subject/:user_id/:subject_id", to: "user_infos#remove_subject"
  default_url_options :host => "localhost:3000"
  devise_for :users,
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations",
               omniauth_callbacks: "users/omniauth_callbacks",
             }, defaults: { format: :json }
  delete "/users/remove/:id", to: "user_infos#destroyuser"
  get "/google-login", to: "glogin#login"
  get "/ping", to: "static#home"
  get "/ping/admin", to: "static#created"
end
