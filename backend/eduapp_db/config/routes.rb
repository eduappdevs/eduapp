Rails.application.routes.draw do  
  resources :resources
  resources :eduapp_user_sessions
  resources :user_infos
  default_url_options :host => "localhost:3000"
  devise_for :users,
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations'
             }
  get '/member-data', to: 'members#show'

end