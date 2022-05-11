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
end