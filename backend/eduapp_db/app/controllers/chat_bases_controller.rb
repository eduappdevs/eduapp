class ChatBasesController < ApplicationController
  before_action :set_chat_basis, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  require "edu_app_utils/encrypt_utils"

  # GET /chat_bases
  def index
    wants_complete_chat = false

    # Made to return all necessary information for a chat.
    if params[:complete_chat_for]
      wants_complete_chat = true
      if !check_user_in_chat(params[:complete_chat_for])
        return
      end
      chatBase = ChatBase.find(params[:complete_chat_for])
      chat = chatBase.serializable_hash(:except => [:created_at, :updated_at])
      other_participants = ChatParticipant.where(chat_base_id: params[:complete_chat_for])

      # Not the best way, but a way to track readed chats
      chatBase.chat_participants.where(user_id: @current_user).first.update_attribute(:last_seen, DateTime.now)
      
      participants = []
      other_participants.each do |participant|
        p = UserInfo.where(user_id: participant.user_id).first.serializable_hash(:only => [:profile_image, :user_name], :include => [:user])
        p.merge!({ isChatAdmin: participant.isChatAdmin })
        participants.push(p)
      end

      # Be able to gather the counterpart info even if they left the chat
      if chat["chat_name"].include?("private_chat_")
        if participants.length < 2
          name_disect = chat["chat_name"].split("_")
          name_disect.delete("private")
          name_disect.delete("chat")

          chat_counterpart_id = name_disect[0] == participants[0]["user"]["id"] ? name_disect[1] : name_disect[0]
          chat_counterpart = UserInfo.where(user_id: chat_counterpart_id).first.serializable_hash(:only => [:profile_image, :user_name], :include => [:user])
          participants.push(chat_counterpart)
        end
      end

      @chat_bases = { chat: chat, participants: participants }
    else
      if !check_perms_all!(get_user_roles.perms_chat)
        return
      end
      @chat_bases = ChatBase.all
    end

    if !wants_complete_chat
      if !params[:order].nil? && Base64.decode64(params[:order]) != "null"
        order = JSON.parse(Base64.decode64(params[:order]))
        order["field"] = order["field"] == "name" ? "chat_name" : order["field"]
        @chat_bases = @chat_bases.order({ order["field"] => order["order"] == "asc" ? :asc : :desc })
      else
        @chat_bases = @chat_bases.order(chat_name: :asc)
      end
    end

    if params[:page]
      @chat_bases = query_paginate(@chat_bases, params[:page])
    end

    render json: @chat_bases
  end

  # Returns a filtered query based on the parameters passed.
  def filter
    chat_query = {}
    params.each do |param|
      next unless param[0] == "chat_name"
      next unless param[1] != "null" && param[1].length > 0

      chat_query.merge!({ param[0] => param[1] })
    end

    final_query = nil

    if chat_query["chat_name"]
      final_query = ChatBase.where("chat_name LIKE ?", "%#{chat_query["chat_name"]}%")
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at], [])
    end

    render json: { filtration: final_query }
  end

  # GET /chat_bases/1
  def show
    if !check_user_in_chat(@chat_basis.id)
      if !check_perms_query!(get_user_roles.perms_chat)
        return
      end
    end
    render json: @chat_basis
  end

  # Checks if a user has an open ```ChatBase``` with the system user.
  def has_system_notifs
    if !check_perms_query!(get_user_roles.perms_chat)
      return
    end
    notifs = ChatBase.where(chat_name: "private_chat_system_#{params[:user_id]}")

    if notifs.count > 0
      render json: notifs.first, status: :ok and return
    end

    render json: { :error => "User has no system chat." }, status: 404
  end

  # POST /chat_bases
  def create
    if !check_perms_write!(get_user_roles.perms_chat)
      return
    end
    if params[:chat_name].include?("private_chat_")
      nameDisect = params[:chat_name].split("_")
      inverted_name = "private_chat_#{nameDisect[3]}_#{nameDisect[2]}"
      nameExists = ChatBase.where(chat_name: params[:chat_name])
      invertedExists = ChatBase.where(chat_name: inverted_name)

      if nameExists.count > 0 || invertedExists.count > 0
        return render json: { error: "Chat already exists" }, status: :unprocessable_entity
      end
      @chat_basis = ChatBase.new(
        chat_name: params[:chat_name],
        isGroup: params[:isGroup],
        isReadOnly: params[:isReadOnly].nil? ? false : params[:isReadOnly],
      )
      pri_key, pub_key = EduAppUtils::EncryptUtils::gen_key_pair(@chat_basis.id)
      @chat_basis.private_key = pri_key
      @chat_basis.public_key = pub_key

      if @chat_basis.save
        render json: @chat_basis, status: :created, location: @chat_basis
      else
        render json: @chat_basis.errors, status: :unprocessable_entity
      end
    else
      @chat_basis = ChatBase.new(
        chat_name: params[:chat_name],
        isGroup: params[:isGroup],
        isReadOnly: params[:isReadOnly].nil? ? false : params[:isReadOnly],
      )
      pri_key, pub_key = EduAppUtils::EncryptUtils::gen_key_pair(@chat_basis.id)
      @chat_basis.private_key = pri_key
      @chat_basis.public_key = pub_key

      if @chat_basis.save
        render json: @chat_basis, status: :created, location: @chat_basis
      else
        render json: @chat_basis.errors, status: :unprocessable_entity
      end
    end
  end

  # PUT /chat_bases/1
  def update
    if !check_perms_update!(get_user_roles.perms_chat, false, :null)
      return
    end
    if @chat_basis.update(chat_basis_params)
      render json: @chat_basis
    else
      render json: @chat_basis.errors, status: :unprocessable_entity
    end
  end

  # # PUT /chat_bases/1/read
  # def read
  #   if !check_perms_update!(get_user_roles.perms_chat, false, :null)
  #     return
  #   end
  #   @chat_basis.participants.where(user_id: @current_user).first.update_attribute(:last_seen, DateTime.now())
  #   render json: {read: DateTime.now()}
  # end

  # DELETE /chat_bases/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_chat, false, :null)
      return
    end
    @chat_basis.destroy
  end

  private

  # Checks if a user is in a certain ```ChatBase```.
  def check_user_in_chat(chat_base_id)
    if ChatParticipant.where(user_id: @current_user, chat_base_id: chat_base_id).count > 0 || get_user_roles.name === "eduapp_admin"
      return true
    end
    return false
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_chat_basis
    @chat_basis = ChatBase.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def chat_basis_params
    params.require(:chat_basis).permit(:chat_name, :isGroup)
  end
end
