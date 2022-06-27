class UserInfosController < ApplicationController
  before_action :set_user_info, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!



  # GET /user_infos
  def index
    if params[:user_id]
      if !check_perms_query_self!(get_user_roles.perms_users, params[:user_id])
        return
      end
      @user_infos = UserInfo.where(user_id: params[:user_id])
    elsif params[:name]
      # TODO: CHECK IS USER CAN SEARCH BY NAME
      @user_infos = UserInfo.search_name(params[:name]).take(3)
    else
      if !check_perms_all!(get_user_roles.perms_users)
        return
      end
      @user_infos = UserInfo.all
    end

    if params[:page]
      @user_infos = query_paginate(@user_infos, params[:page])
      @user_infos[:current_page] = serialize_each(@user_infos[:current_page], [:created_at, :updated_at, :user_id, :user_role_id], [:user, :user_role])
      @user_infos[:current_page].each do |user_info|
        user_info["user"]["last_sign_in_at"] = User.find(user_info["user"]["id"]).last_sign_in_at
      end
    end
    render json: @user_infos
  end

  # GET /user_infos/1
  def show
    if !check_perms_query!(get_user_roles.perms_users)
      return
    end
    render json: @user_info
  end

  def system_user
    render json: UserInfo.where(user_name: "eduapp_system", user_role_id: get_admin_role.id).first, status: :ok and return
  end

  # POST /user_infos
  def create
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.new(user_info_params)
    if @user_info.save
      render json: @user_info, status: :created, location: @user_info
    else
      render json: @user_info.errors, status: :unprocessable_entity
    end
  end

  def add_subject
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.where(user_id: params[:user_id]).first
    if @user_info.teaching_list.include?(params[:subject_id])
      render json: { message: "Subject already added" }, status: :unprocessable_entity and return
    end
    @user_info.teaching_list << Subject.find(params[:subject_id]).id
    @user_info.save
    render json: @user_info
  end

  def add_events
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.all
    calendar_annotation = CalendarAnnotation.where(isPop: true)

    @user_info.each do |user_info|
      calendar_annotation.each do |annotation|
        if user_info.calendar_event.include?(annotation.id.to_s)
          puts "already added"
        else
          user_info.calendar_event << annotation.id
        end
      end
      user_info.save
    end
     render json: @user_info
  end

  def remove_event
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.where(user_id: params[:user_id]).first
    puts "userInfo: #{@user_info}"
    @user_info.calendar_event.delete(CalendarAnnotation.find(params[:calendar_event]).id)
    @user_info.save
    render json:@user_info
  end

  def remove_subject
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.where(user_id: params[:user_id]).first
    @user_info.teaching_list.delete(Subject.find(params[:subject_id]).id)
    @user_info.save
    render json: @user_info
  end

  # PATCH/PUT /user_infos/1
  def update
    if !can_update_self(@user_info.user_id)
      if !check_perms_update!(get_user_roles.perms_users)
        return
      end
    end

    if @user_info.update(user_info_params)
      render json: @user_info
    else
      render json: @user_info.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_infos/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_users, true, UserInfo.find(params[:id]).user_id)
      return
    end
    @user_info.destroy
  end

  def destroyuser
    if !check_perms_delete!(get_user_roles.perms_users, true, params[:id])
      return
    end
    user = User.find(params[:id])
    user_i = UserInfo.find_by(user_id: params[:id])
    user_tui = Tuition.where(user_id: params[:id])
    user_jtis = JtiMatchList.where(user_id: params[:id])

    if UserInfo.where(user_role_id: get_admin_role.id).count === 1 && user_i.user_role_id === get_admin_role.id
      render json: { message: "Cannot delete the last admin." }, status: 403
      return
    end

    user_jtis.each do |jti|
      jti.destroy
    end

    user_tui.each do |tuition|
      tuition.destroy
    end

    if user_i.destroy
      if user.destroy
        render json: { message: "Deleted user successfully." }, status: :ok
      else
        render json: { message: "Couldn't delete user" }, status: 500
      end
    else
      render json: { message: "Couldn't delete user info" }, status: 500
    end
  end

  private

  def can_update_self(requester_id)
    if requester_id === @current_user
      return true
    end
    return false
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_user_info
    @user_info = UserInfo.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_info_params
    params.permit(:user_name, :user_id, :user_role, :calendar_event, :profile_image, :teaching_list, :googleid, :isLoggedWithGoogle)
  end
end
