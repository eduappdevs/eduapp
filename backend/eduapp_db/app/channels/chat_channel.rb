class ChatChannel < ApplicationCable::Channel
	require 'json'
  def subscribed
		@chat_name = "eduapp.channel.#{params[:chat_room]}"
		stream_from @chat_name
  end

	def receive(data)
		puts "CMD: #{data["command"]}"

		case data["command"]
		when "gatherAll"
			msgs = []
			for msg in ChatMessage.where(chat_base_id: params[:chat_code]) do
				msgs.append(format_msg(msg))
			end

			ActionCable.server.broadcast @chat_name, msgs
		when "message"
			newMsgHash = {}
			newMsgHash.merge!(JSON.parse("{\"chat_base_id\": #{params[:chat_code]}}"))
			newMsgHash.merge!(JSON.parse("{\"user_id\": #{data["author"]}}"))
			newMsgHash.merge!(JSON.parse("{\"message\": \"#{data["message"]}\"}"))
			newMsgHash.merge!(JSON.parse("{\"send_date\": \"#{data["send_date"]}\"}"))

			instance = ChatMessage.new(JSON.parse(newMsgHash.to_json))
			instance.save

			newMsg = format_msg(instance)
			newMsg.merge!(JSON.parse("{\"command\": \"new_message\"}"))
			
			ActionCable.server.broadcast @chat_name, newMsg
		else
			puts "DEFAULT"
		end
	end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

	protected

	def format_msg(queryMsg)
		mainMsg = JSON.parse(queryMsg.to_json)
		mainMsg.merge!(JSON.parse("{\"chat_base\": #{queryMsg.chat_base.to_json}}"))
		mainMsg.merge!(JSON.parse("{\"user\": #{queryMsg.user.to_json}}"))
		mainMsg.delete("chat_base_id")
		mainMsg.delete("user_id")
		
		return mainMsg
	end
end
