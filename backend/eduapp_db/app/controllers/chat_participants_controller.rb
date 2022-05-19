class ChatParticipantsController < ApplicationController
  before_action :set_chat_participant, only: [:show, :update, :destroy]
	before_action :authenticate_user!

	require 'edu_app_utils/encrypt_utils'

  # GET /chat_participants
  def index
		if params[:user_id]
			@participants = ChatParticipant.where(user_id: params[:user_id])
		elsif params[:chat_id]
			@participants = ChatParticipant.where(chat_base_id: params[:chat_id])
		else
			@participants = ChatParticipant.all
		end

    render json: @participants
  end

  # GET /chat_participants/1
  def show
    render json: @chat_participant
  end

  # POST /chat_participants
  def create
		if params[:chat_name].include?("private_chat_")
			pri_key, pub_key = EduAppUtils::EncryptUtils::gen_key_pair(User.find(params[:user_id]).encrypted_password)
			@chat_participant = ChatParticipant.new(
				private_key: pri_key,
				public_key: pub_key,
				chat_base_id: params[:chat_base_id],
				user_id: params[:user_id]
			)
			if @chat_participant.save
				render json: @chat_participant, status: :created, location: @chat_participant
			else
				render json: @chat_participant.errors, status: :unprocessable_entity
			end
		else
			@chat_participant = ChatParticipant.new(chat_participant_params)
			if @chat_participant.save
				render json: @chat_participant, status: :created, location: @chat_participant
			else
				render json: @chat_participant.errors, status: :unprocessable_entity
			end
		end
  end

  # PATCH/PUT /chat_participants/1
  def update
    if @chat_participant.update(chat_participant_params)
      render json: @chat_participant
    else
      render json: @chat_participant.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chat_participants/1
  def destroy
    @chat_participant.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chat_participant
      @chat_participant = ChatParticipant.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def chat_participant_params
      params.require(:chat_participant).permit(:chat_base_id, :user_id, :isChatAdmin)
    end
end
