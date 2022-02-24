Rails.application.routes.draw do  
  resources :calendar_annotations
  resources :tuitions
  resources :courses
  resources :institutions
  resources :resources
  resources :eduapp_user_sessions
  resources :user_infos
  default_url_options :host => "localhost:3000"
  devise_for :users,
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations',
             }
  get '/google-login', to: 'glogin#login'
  get '/member-data', to: 'members#show'

end