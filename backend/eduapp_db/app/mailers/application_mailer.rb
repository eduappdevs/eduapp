class ApplicationMailer < ActionMailer::Base
  default from: 'eduappdevelopment@gmail.com'
  layout 'mailer'

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:email, :password, :password_confirmation) }
    devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:email, :password, :password_confirmation, :current_password)}
  end
end
