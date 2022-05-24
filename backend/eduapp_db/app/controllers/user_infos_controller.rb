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
    render json: UserInfo.where(user_name: "eduapp_system", isAdmin: true).first, status: :ok and return
  end

  # POST /user_infos
  def create
    if !check_perms_write!(get_user_roles.perms_roles)
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
    if !check_perms_write!(get_user_roles.perms_roles)
      return
    end
    @user_info = UserInfo.where(user_id: params[:user_id]).first
    puts @user_info.to_json
    puts "\n\n\n#{Subject.find(params[:subject_id]).id}"
    @user_info.teaching_list << Subject.find(params[:subject_id]).id
    @user_info.save
    render json: @user_info
  end

  def remove_subject
    if !check_perms_write!(get_user_roles.perms_roles)
      return
    end
    @user_info = UserInfo.where(user_id: params[:user_id]).first
    @user_info.teaching_list.delete(Subject.find(id: params[:subject_id]).id)
    @user_info.save
    render json: @user_info
  end

  # PATCH/PUT /user_infos/1
  def update
    if !check_perms_update!(get_user_roles.perms_roles)
      return
    end

    if @user_info.update(user_info_params)
      render json: @user_info
    else
      render json: @user_info.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_infos/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_roles)
      return
    end
    @user_info.destroy
  end

  def destroyuser
    if !check_perms_delete!(get_user_roles.perms_roles)
      return
    end
    user = User.find(params[:id])
    user_i = UserInfo.find_by(user_id: params[:id])
    user_tui = Tuition.where(user_id: params[:id])
    user_jtis = JtiMatchList.where(user_id: params[:id])

    if UserInfo.where(isAdmin: true).count == 1 && user_i.isAdmin
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

  # Use callbacks to share common setup or constraints between actions.
  def set_user_info
    @user_info = UserInfo.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_info_params
    params.permit(:user_name, :user_id, :user_role, :profile_image, :teaching_list, :isAdmin, :isTeacher, :googleid, :isLoggedWithGoogle)
  end
end
