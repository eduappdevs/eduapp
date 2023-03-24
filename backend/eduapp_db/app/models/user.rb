class User < ApplicationRecord
  require "jwt"

  devise :database_authenticatable,
         :jwt_authenticatable,
         :registerable,
         :trackable,
         :recoverable,
         jwt_revocation_strategy: self

  has_one :user_info
  has_many :tuitions
  has_many :subjects_user
  has_many :subjects, through: :subjects_user
  has_many :push_notifications

  # Allow user to login either with username and email

  attr_writer :login

  def login
    @login || self.username || self.email
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    login = conditions.delete(:login)
    where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.strip.downcase }]).first
  end

  # JWT Management

  @secret = ENV.fetch("RAILS_SECRET_KEY")

  # Generates a new ```JtiMatchList``` entry for the user.
  def self.generate_jti(user, user_ip)
    iat, exp = self.gen_exp
    jti = self.gen_jti iat

    jwtEntry = JtiMatchList.new(
      user_id: user["user_id"],
      jti: jti,
      exp: exp,
      access_ip: user_ip,
    )
    if jwtEntry.save
      return true
    else
      return { error: jwtEntry.errors.messages }
    end
  end

  # Generates a JWT Token for a user.
  def self.generate_token(user, user_ip)
    iat, exp = self.gen_exp

    userTotalJti = JtiMatchList.where(user_id: user["user_id"]).order(created_at: :desc)
    userTotalJti.last.destroy if userTotalJti.count === 4 # Logs out the last connection's IP for a new connection.

    existingUserJti = JtiMatchList.where(user_id: user["user_id"], access_ip: user_ip)
    if existingUserJti.count > 0
      jti = existingUserJti.first.jti
    else
      if self.generate_jti(user, user_ip) === true
        existingUserJti = JtiMatchList.where(user_id: user["user_id"], access_ip: user_ip)
      else
        return { error: "Failed to generate token." }
      end
    end

    user_role = UserRole.find(UserInfo.where(user_id: existingUserJti[0].user_id).first.user_role_id)
    return { error: "Failed to find user role." } if !user_role

    payload = {
      iat: iat,
      exp: exp,
      aud: user_role.name,
      jti: jti.nil? ? existingUserJti[0].jti : jti,
      sub: existingUserJti[0].user_id,
    }

    if existingUserJti.update(exp: exp)
      return JWT.encode payload, @secret, "HS256"
    else
      return { error: jwtEntry.errors.messages }
    end
  end

  # Decodes a JWT Token.
  def self.unlock_token(token)
    begin
      return JWT.decode token, @secret, true, { verify_jti: true, aud: "user", algorithm: "HS256" }
    rescue JWT::ExpiredSignature => expired
      return { error: "Token has expired: #{expired}" }
    rescue JWT::VerificationError, JWT::DecodeError, JWT::ImmatureSignature => err
      return { error: "Verify Token is invalid: #{err}" }
    end
  end

  # Revokes a JWT Token from a user.
  def self.revoke_token(user, user_ip)
    revokedUserJti = JtiMatchList.where(user_id: user, access_ip: user_ip)

    iat, exp = self.gen_exp
    if revokedUserJti.update(exp: exp, jti: self.gen_jti(iat))
      return true
    else
      return { error: revokedUserJti.errors.messages }
    end
  end

  private

  # Generates an expiration for an hour in time.
  def self.gen_exp
    return Time.now.to_i, 1.hour.from_now.to_i # [iat, exp]
  end

  # Returnes a newly signed JTI.
  def self.gen_jti(issued_at)
    return Digest::SHA256.hexdigest([@secret, issued_at].join(":").to_s)
  end
end
