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
        chat = ChatBase.find(chatp.chat_base_id).serializable_hash(:except => [:private_key, :public_key, :created_at, :updated_at])
        if chat["chat_name"].include?("private_chat_")
          chat_counterpart = ChatParticipant.where(chat_base_id: chat["id"]).where.not(user_id: params[:chats_for]).first
          final_chats.push({
            chat_info: chat,
            chat_participant: UserInfo.where(user_id: chat_counterpart.user_id).first.serializable_hash(:except => [:created_at, :updated_at, :user_role_id, :googleid]),
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
    end

    render json: @participants
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

  # PATCH/PUT /chat_participants/1
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
    if !check_perms_delete!(get_user_roles.perms_chat_participants, false, :null)
      return
    end
    @chat_participant.destroy
  end

  private

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
