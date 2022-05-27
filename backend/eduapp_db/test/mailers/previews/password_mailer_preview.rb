class PasswordMailerPreview < ActionMailer::Preview
    def send_reset_email
        PasswordMailer.with(user: User.find_by(email: 'ceniiziienta@gmail.com')).send_reset_email
    end
end