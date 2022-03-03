class User < ApplicationRecord
  devise :database_authenticatable,
         :jwt_authenticatable,
         :registerable,
         :omniauthable,
         omniauth_providers: [:google_oauth2],
         jwt_revocation_strategy: JwtDenylist
         
  has_one :user_info

  def self.from_omniauth(access_token)
    data = access_token.info
    puts data
    puts data['googleId']
    user = User.find_by(id: UserInfo.find_by(googleid: data['googleId']))
    user
  end
end