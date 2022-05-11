class Users::PasswordsController < Devise::PasswordsController
  before_action :authenticate_user! , only: [:get_reset_password_token,:do_reset_password]

  def do_reset_password
    user = User.find_by(email: params[:email]);
    if user.reset_password_token == params[:token]
      user.reset_password(params[:password],params[:password_confirmation])
      render json: {status: 'success'}
    else
      render json: {status: 'failure'}
    end
  end

  def send_reset_password_link
    user = User.find_by(email: params[:email])
    if user.present?
      @token = user.reset_password_token
      unless @token.present?
        user.send(:set_reset_password_token) 
        user.save
      end
      if @token.present?
        PasswordMailer.with(user: user).send_reset_email.deliver_now
        render json: {message: 'email sent to '+ user.email,status: 'success', expires_in: 15.minutes.from_now}
      else
        render json: {message: 'email not sent',status: 'failure, no token'}
      end
    else
      render json: {status: 'failure, no user'}
    end
  end

end
