class ChatParticipantsController < ApplicationController
  before_action :set_chat_participant, only: [:show, :update, :destroy]

  # GET /chat_participants
  def index

		if !params[:user_id]
			@has_user_id = ChatParticipant.all
		else 
			@has_user_id = ChatParticipant.where(user_id: params[:user_id])
		end

    @chat_participants = @has_user_id

    render json: @chat_participants
  end

  # GET /chat_participants/1
  def show
    render json: @chat_participant
  end

  # POST /chat_participants
  def create
    @chat_participant = ChatParticipant.new(chat_participant_params)

    if @chat_participant.save
      render json: @chat_participant, status: :created, location: @chat_participant
    else
      render json: @chat_participant.errors, status: :unprocessable_entity
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
