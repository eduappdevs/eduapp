class UserNotifsChannel < ApplicationCable::Channel
  def subscribed
    @user_count = 0 unless @user_count.instance_of?(Integer)
    reject unless check_auth_token(params[:token]) && check_user && @user_count == 0
    @chat_name = "eduapp.notifs.user.#{params[:user_id]}"
    @user_count = 1
    stream_from @chat_name
    stream_for @notifs_user
  end

  def receive(cmd)
    case cmd["command"]
    when "new_msgs"
      puts "hi"
    else
    end
  end

  def unsubscribed
    @user_count = 0
    @notifs_user = nil
  end

  private

  def check_auth_token(token)
    if token.nil?
      return false
    end

    token = token.split("Bearer ").last
    jwt_payload = User.unlock_token(token)
    if jwt_payload.instance_of? Array
      if Time.now.to_i > Integer(jwt_payload[0]["exp"])
        return false
      end
      jtiMatch = JtiMatchList.where(user_id: jwt_payload[0]["sub"], jti: jwt_payload[0]["jti"])
      if !jtiMatch.present?
        return false
      end
      @notifs_user = jwt_payload[0]["sub"]
    else
      return false
    end
  end

  def check_user
    if @notifs_user.nil?
      return false
    else
      user = User.find(@notifs_user)
      if user.nil?
        return false
      end

      if user.id != params[:user_id]
        return false
      end
      return true
    end
  end

  def set_user_count
    @user_count = 0
  end
end
