class ChatChannel < ApplicationCable::Channel
  require "json"
  require "edu_app_utils/encrypt_utils"

  def subscribed
    reject and return unless check_chat_user(params[:chat_room][1..-1], params[:connection_requester])
    @chat_name = "eduapp.channel.#{params[:chat_room]}"
    stream_from @chat_name
  end

  def receive(data)
    case data["command"]
    when "message"
      instance = ChatMessage.new(
        chat_base_id: params[:chat_room][1..-1],
        user_id: data["author"],
        message: data["message"],
        send_date: data["send_date"],
      )

      if instance.save
        newMsg = format_msg(instance)
        newMsg.merge!(JSON.parse("{\"command\": \"new_message\"}"))

        ActionCable.server.broadcast @chat_name, newMsg
      else
        ActionCable.server.broadcast @chat_name, { "command" => "error", "message" => "Error saving message" }
      end

      current_chat = ChatBase.find(params[:chat_room][1..-1])
      ChatParticipant.where(chat_base_id: current_chat.id).each do |participant|
        if participant.user_id != data["author"]
          UserNotifsChannel.broadcast_to(
            participant.user_id,
            command: "new_msg",
            author_name: UserInfo.find_by(user_id: data["author"]).user_name,
            author_pic: UserInfo.find_by(user_id: data["author"]).profile_image,
            msg: data["message"],
            key: current_chat.private_key,
            chat_url: "#{ENV.fetch("REACT_APP_FRONTEND_ENDPOINT")}/chat/#{current_chat.isGroup ? "g" : "p"}#{current_chat.id}",
          )

          subcriptions = PushNotification.where(user_id: participant.user_id)
          user = UserInfo.find_by(user_id: data["author"])
          message = {
            title: "Nuevo mensaje",
            body: data["message"],
            user: user.user_name,
            icon: user.profile_image,
            privKey: current_chat.private_key
          }
          subcriptions.each do |subcription|
            begin
              Webpush.payload_send(
                endpoint: subcription.endpoint,
                message: JSON.generate(message),
                p256dh: subcription.p256dh,
                auth: subcription.auth,
                vapid: {
                  subject: "mailto:email@example.com",
                  public_key: ENV.fetch('VAPID_PUBLIC_KEY'),
                  private_key: ENV.fetch('VAPID_PRIVATE_KEY')
                }
              )
            rescue Webpush::ExpiredSubscription => e
              subcription.destroy
            rescue Exception => e
              e
            end
          end
        end
      end
    else
      puts "DEFAULT"
    end
  end

  def unsubscribed
  end

  protected

  def format_msg(queryMsg)
    mainMsg = JSON.parse(queryMsg.to_json)
    mainMsg.merge!(JSON.parse("{\"chat_base\": #{queryMsg.chat_base.to_json}}"))
    mainMsg.merge!(JSON.parse("{\"user\": #{queryMsg.user.to_json}}"))
    mainMsg.delete("chat_base_id")
    mainMsg.delete("user_id")
    mainMsg["chat_base"].delete("private_key")
    mainMsg["chat_base"].delete("public_key")

    return mainMsg
  end

  # Checks if user belongs to that chat.
  def check_chat_user(chat_base_id, user_id)
    chat_participants = ChatParticipant.where(chat_base_id: chat_base_id)
    chat_participants.each do |participant|
      if participant.user_id == user_id
        return true
      end
    end
    return false
  end
end
