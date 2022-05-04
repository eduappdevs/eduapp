class ChatBasesController < ApplicationController
	require 'json'
  before_action :set_chat_basis, only: [:show, :update, :destroy]

  # GET /chat_bases
  def index
    @chat_bases = ChatBase.all

    render json: @chat_bases
  end

  # GET /chat_bases/1
  def show
    render json: @chat_basis
  end

  # POST /chat_bases
  def create
		if params[:chat_name].include?("private_chat_")
			nameDisect = params[:chat_name].split("_")
			inverted_name = "private_chat_#{nameDisect[3]}_#{nameDisect[2]}"
			nameExists = ChatBase.where(chat_name: params[:chat_name])
			invertedExists = ChatBase.where(chat_name: inverted_name)

			if !(nameExists === []) || !(invertedExists === []) 
				render json: {error: "Chat already exists"}, status: :unprocessable_entity
			else
				@chat_basis = ChatBase.new(chat_basis_params)

				if @chat_basis.save
					render json: @chat_basis, status: :created, location: @chat_basis
				else
					render json: @chat_basis.errors, status: :unprocessable_entity
				end
			end
		
		else 
			@chat_basis = ChatBase.new(chat_basis_params)

			if @chat_basis.save
				render json: @chat_basis, status: :created, location: @chat_basis
			else
				render json: @chat_basis.errors, status: :unprocessable_entity
			end
		end
  end

  # PATCH/PUT /chat_bases/1
  def update
    if @chat_basis.update(chat_basis_params)
      render json: @chat_basis
    else
      render json: @chat_basis.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chat_bases/1
  def destroy
    @chat_basis.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chat_basis
      @chat_basis = ChatBase.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def chat_basis_params
      params.require(:chat_basis).permit(:chat_name, :isGroup)
    end
end
