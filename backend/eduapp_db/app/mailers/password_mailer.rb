class PasswordMailer < ApplicationMailer
  layout 'mailer'
  def send_reset_email
    @user = params[:user]
    @url
    if @user.present? 
      token = @user.reset_password_token
      @url = ENV.fetch("FRONTEND_URL") + "/password/reset?email="+ @user.email + "&token="+token
      mail(to: @user.email, subject: 'EduApp Password Reset', url: @url)
    else
      render json: {status: 'failure'}
    end
  end


  def send_confirmation_email
    @user = params[:user]
    @confirmation_code = SecureRandom.hex
    @expireCodeDate = DateTime.now + 20.minutes
    if @user.present?
      @user.confirmation_code = @confirmation_code
      @user.confirmation_code_exp_time = @expireCodeDate
      @user.save
      mail(to: @user.email, subject: 'EduApp Confirmation', confirmation_code: @confirmation_code)
      render json: {status: 'success', expires_in: @expireCodeDate , message: 'code sent to '+ @user.email}
    else
      render json: {status: 'failure', message: 'User not found in send_confirmation_email'}
    end
  end
end