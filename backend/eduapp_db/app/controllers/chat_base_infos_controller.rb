class ChatBaseInfosController < ApplicationController
  before_action :set_chat_base_info, only: [:show, :update, :destroy]
	before_action :authenticate_user!

  # GET /chat_base_infos
  def index
    @chat_base_infos = ChatBaseInfo.all

    render json: @chat_base_infos
  end

  # GET /chat_base_infos/1
  def show
    render json: @chat_base_info
  end

  # POST /chat_base_infos
  def create
    @chat_base_info = ChatBaseInfo.new(chat_base_info_params)

    if @chat_base_info.save
      render json: @chat_base_info, status: :created, location: @chat_base_info
    else
      render json: @chat_base_info.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /chat_base_infos/1
  def update
    if @chat_base_info.update(chat_base_info_params)
      render json: @chat_base_info
    else
      render json: @chat_base_info.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chat_base_infos/1
  def destroy
    @chat_base_info.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chat_base_info
      @chat_base_info = ChatBaseInfo.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def chat_base_info_params
      params.require(:chat_base_info).permit(:chat_base_id, :chat_img)
    end
end
