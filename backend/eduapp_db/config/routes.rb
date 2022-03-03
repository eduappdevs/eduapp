Rails.application.routes.draw do  
	mount ActionCable.server => "/chat"
  resources :chat_messages
  resources :chat_participants
  resources :chat_base_infos
  resources :chat_bases
  resources :subjects
  get 'calendar_annotations/index'
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
<<<<<<< HEAD
             }
	delete 'users/remove/:id', to: 'user_infos#destroyuser'
  get '/google-login', to: 'glogin#login'
=======
               omniauth_callbacks: 'users/omniauth_callbacks'
  }

>>>>>>> ba2ffa3104a24bee656bdb6e8645c5cec8ada2f6
  get '/member-data', to: 'members#show'
  get '/ping', to: 'static#home'
end