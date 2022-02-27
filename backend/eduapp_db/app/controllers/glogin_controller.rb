class GloginController < ApplicationController
  require 'json'
  include Devise::Controllers::SignInOut
  
    def login()
      sign_in :user, User.find_by(id: UserInfo.find_by(googleid: params[:googleid]).user_id)
      render json: { message: params[:googleid]}
    end
  end