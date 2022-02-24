class GloginController < ApplicationController
  include Devise::Controllers::SignInOut
  
    def login
      sign_in(User.first)
      render json: { message: User.first}, status: :unauthorized
    end
  end