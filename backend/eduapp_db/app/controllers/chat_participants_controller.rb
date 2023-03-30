class ChatParticipantsController < ApplicationController
  before_action :set_chat_participant, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /chat_participants
  def index
    if params[:user_id]
      if !check_perms_query_self!(get_user_roles.perms_chat_participants, params[:user_id])
        return
      end
      @participants = ChatParticipant.where(user_id: params[:user_id])
    elsif params[:chats_for]
      if !check_perms_query_self!(get_user_roles.perms_chat_participants, params[:chats_for])
        return
      end
      user_chats = ChatParticipant.where(user_id: params[:chats_for])

      final_chats = []
      user_chats.each do |chatp|
        chatBase = ChatBase.find(chatp.chat_base_id)
        lastMessage = chatBase.chat_messages.last || ChatMessage.new(send_date: chatBase.created_at)
        chatSelfCounterpart = chatBase.chat_participants.where({user_id: params[:chats_for]}).first
        chat = chatBase.serializable_hash(:except => [:private_key, :public_key, :created_at, :updated_at]).merge({
          last_message: lastMessage.serializable_hash,
          self_counterpart: chatSelfCounterpart.serializable_hash
        })
        if chat["chat_name"].include?("private_chat_")
          chat_counterpart = ChatParticipant.where(chat_base_id: chat["id"]).where.not(user_id: params[:chats_for]).first

          # Be able to gather the counterpart info even if they left the chat
          if chat_counterpart == nil
            name_disect = chat["chat_name"].split("_")
            name_disect.delete("private")
            name_disect.delete("chat")

            chat_counterpart_id = name_disect[0] == params[:chat_for] ? name_disect[1] : name_disect[0]
            chat_counterpart = UserInfo.where(user_id: chat_counterpart_id).first
          end

          final_chats.push({
            chat_info: chat,
            chat_participant: UserInfo.where(user_id: chat_counterpart.user_id).first.serializable_hash(:except => [:created_at, :updated_at, :user_role_id, :googleid]), # .merge(chat_counterpart.serializable_hash),
          })
        else
          final_chats.push({ chat_info: chat })
        end
      end
      @participants = { personal_chats: final_chats }
    elsif params[:chat_id]
      if !check_perms_query!(get_user_roles.perms_chat_participants)
        return
      end
      @participants = ChatParticipant.where(chat_base_id: params[:chat_id])
    else
      if !check_perms_all!(get_user_roles.perms_chat_participants)
        return
      end
      @participants = ChatParticipant.all
    end

    if params[:page]
      @participants = query_paginate(@participants, params[:page])
      @participants[:current_page] = serialize_each(@participants[:current_page], [:created_at, :updated_at, :user_id, :chat_base_id], [:user, :chat_base])
    end
    

    render json: @participants
  end

  # Returns a filtered query based on the parameters passed.
  def filter
    parts_query = {}
    params.each do |param|
      next unless param[0] == "email" || param[0] == "chat_name"
      next unless param[1] != "null" && param[1].length > 0

      parts_query.merge!({ param[0] => param[1] })
    end

    final_query = nil

    if parts_query["email"]
      final_query = ChatParticipant.where(user_id: User.where("email LIKE ?", "%#{parts_query["email"]}%"))
    end

    if parts_query["chat_name"]
      if !final_query.nil?
        final_query = final_query.where(chat_base_id: ChatBase.where("chat_name LIKE ?", "%#{parts_query["chat_name"]}%"))
      else
        final_query = ChatParticipant.where(chat_base_id: ChatBase.where("chat_name LIKE ?", "%#{parts_query["chat_name"]}%"))
      end
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :user_id, :chat_base_base], [:chat_base, :user])
    end

    render json: { filtration: final_query }
  end

  # GET /chat_participants/1
  def show
    if !check_perms_query!(get_user_roles.perms_chat_participants)
      return
    end
    render json: @chat_participant
  end

  # POST /chat_participants
  def create
    if !check_perms_write!(get_user_roles.perms_chat_participants)
      return
    end
    @chat_participant = ChatParticipant.new(chat_participant_params)
    if @chat_participant.save
      render json: @chat_participant, status: :created, location: @chat_participant
    else
      render json: @chat_participant.errors, status: :unprocessable_entity
    end
  end

  # PUT /chat_participants/1
  def update
    if !check_perms_update!(get_user_roles.perms_chat_participants, false, :null)
      return
    end

    if @chat_participant.update(chat_participant_params)
      render json: @chat_participant
    else
      render json: @chat_participant.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chat_participants/1
  def destroy
    return if !check_perms_delete!(get_user_roles.perms_chat_participants, false, :null)

    @chat_participant.destroy
  end

  # Removes a user from a chat, and deletes the ```ChatBase``` if
  # no more ```ChatParticipant``` are linked to it.
  def remove_participant
    @chat_participant = ChatParticipant.where(user_id: params[:user_id], chat_base_id: params[:chat_base_id])
    if @chat_participant.length > 0
      @chat_participant.first.destroy

      if ChatParticipant.where(chat_base_id: params[:chat_base_id]).length < 1
        ChatMessage.where(chat_base_id: params[:chat_base_id]).each do |m|
          m.destroy
        end
        ChatBase.find(params[:chat_base_id]).destroy
      end
      return
    end
    return render json: { error: "Participant not found." }, status: 404
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
  def set_chat_participant
    @chat_participant = ChatParticipant.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def chat_participant_params
    params.require(:chat_participant).permit(:chat_base_id, :user_id, :isChatAdmin)
  end
end
