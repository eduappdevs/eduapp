Rails.application.routes.draw do
  default_url_options :host => "localhost:3000"
  resources :eduapp_user_sessions
  root to: 'static#home'
  resources :resources 
  resources :sessions, only: [:create]
  resources :registrations, only: [:create]
  delete :logout, to: 'sessions#logout'
  get :logged_in , to: 'sessions#logged_in'

end
