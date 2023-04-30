class ChatMessagesController < ApplicationController
  before_action :set_chat_message, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /chat_messages
  def index
    if params[:chat_base_id]
      if !check_user_in_chat(params[:chat_base_id])
        return deny_perms_access!
      end
      if params[:send_date]
        @chat_messages = ChatMessage.order(send_date: :asc)
          .where("chat_base_id = :chat_base_id and send_date > :send_date", {
            chat_base_id: params[:chat_base_id], send_date: params[:send_date]
          })
      else
        @chat_messages = ChatMessage.order(send_date: :asc)
          .where(chat_base_id: params[:chat_base_id])
      end
    else
      if !check_perms_all!(get_user_roles.perms_message)
        return
      end
      if params[:send_date]
        @chat_messages = ChatMessage.order(send_date: :asc)
          .where("send_date > ?", params[:send_date])
      else
        @chat_messages = ChatMessage.order(send_date: :asc).all
      end
    end

    if params[:page]
      @chat_messages = query_paginate(@chat_messages, params[:page])
    end

    render json: @chat_messages
  end

  # GET /chat_messages/1
  def show
    if !check_perms_query!(get_user_roles.perms_message)
      return
    end
    render json: @chat_message
  end

  # POST /chat_messages
  def create
    if !check_user_in_chat(params[:chat_base_id])
      if !check_perms_write!(get_user_roles.perms_message)
        return
      end
    end
    @chat_message = ChatMessage.new(chat_message_params)

    if @chat_message.save
      chat_base = ChatBase.find(@chat_message.chat_base_id)
      participans = ChatParticipant.where(chat_base_id: chat_base.id)
      user = UserInfo.find_by(user_id: @chat_message.user_id)

      chat_url = "#{ENV.fetch("REACT_APP_FRONTEND_ENDPOINT")}/chat/#{chat_base.isGroup ? "g" : "p"}#{@chat_message.chat_base_id}"
      participans.each do |participant|
        UserNotifsChannel.broadcast_to(
          participant.user_id,
          command: "new_msg",
          author_name: user.user_name,
          author_pic: user.profile_image,
          msg: @chat_message.message,
          key: chat_base.private_key,
          chat_url: chat_url,
        )
        subcriptions = PushNotification.where(user_id: participant.user_id)
        message = {
          title: "Nuevo mensaje",
          body: "",
          user: user.user_name,
          icon: user.profile_image,
          url: chat_url,
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

      render json: @chat_message, status: :created, location: @chat_message
    else
      render json: @chat_message.errors, status: :unprocessable_entity
    end
  end

  # PUT /chat_messages/1
  def update
    if !check_perms_update!(get_user_roles.perms_message, false, :null) && !check_action_owner!(@chat_message.user_id)
      return
    end

    if @chat_message.update(chat_message_params)
      render json: @chat_message
    else
      render json: @chat_message.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chat_messages/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_roles, false, :null) && !check_user_in_chat(params[:id])
      return
    end
    @chat_message.destroy
  end

  private

  # Checks if a user is in a certain ```ChatBase```.
  def check_user_in_chat(chat_base_id)
    if ChatParticipant.where(user_id: @current_user, chat_base_id: chat_base_id).count > 0 || get_user_roles.name == "eduapp_admin"
      return true
    end
    return false
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_chat_message
    @chat_message = ChatMessage.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def chat_message_params
    params.require(:chat_message).permit(:chat_base_id, :user_id, :message, :send_date)
  end
end
