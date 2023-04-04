class UserInfosController < ApplicationController
  before_action :set_user_info, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /user_infos
  def index
    @user_infos = UserInfo
    if params[:user_id]
      if !check_perms_query_self!(get_user_roles.perms_users, params[:user_id])
        return
      end
      @user_infos = @user_infos.where(user_id: params[:user_id])
    elsif params[:name]
      # TODO: CHECK IF USER CAN SEARCH BY NAME
      @user_infos = @user_infos.search_name(params[:name]).take(3)
    elsif params[:user_name]
      # TODO: CHECK IF USER CAN SEARCH BY USER NAME
      @user_infos = @user_infos.search_name(params[:user_name]) #.take(3)
    elsif params[:email]
      # TODO: CHECK IF USER CAN SEARCH BY EMAIL
      @user_infos = @user_infos.search_email(params[:email]) #.take(3)
    else
      if !check_perms_all!(get_user_roles.perms_users)
        return
      end
    end

    if !params[:order].nil? && Base64.decode64(params[:order]) != "null"
      @user_infos = @user_infos.order(parse_filter_order(params[:order]))
    else
      @user_infos = params[:name] ? @user_infos : @user_infos.order(user_name: :asc)
    end

    if params[:extras]
      extras = filter_extrafields(params[:extras], User)
      @user_infos = @user_infos.where(user_id: extras)
    end

    if params[:page]
      @user_infos = query_paginate(@user_infos, params[:page])
      @user_infos[:current_page] = serialize_each(@user_infos[:current_page], [:created_at, :googleid, :updated_at, :user_id, :user_role_id], [:user, :user_role])
      @user_infos[:current_page].each do |user_info|
        user_info["user"]["last_sign_in_at"] = User.find(user_info["user"]["id"]).last_sign_in_at
      end
    end

    render json: @user_infos
  end

  # Returns a filtered query based on the parameters passed.
  def filter
    infos_query = {}
    user_query = {}
    role_query = {}
    params.each do |param|
      next if param[0] == "controller" || param[0] == "action" || param[0] == "extras" || param[0] == "user_info"
      next unless param[1] != "null" && param[1].length > 0

      query = { param[0] => param[1] }
      case param[0]
      when "user_id", "user_name"
        infos_query.merge!(query)
      when "email"
        user_query.merge!(query)
      when "role"
        role_query.merge!(query)
      end
    end

    extras = filter_extrafields(params[:extras], User)
    final_query = params[:extras] ? (!extras.nil? ? UserInfo.where(user_id: extras) : nil) : nil

    if !infos_query.empty?
      query = !final_query.nil? ? final_query : nil

      if infos_query["user_id"]
        user_ids = []
        UserInfo.all.each do |u|
          user_ids << u.user_id if u.user_id.to_s =~ /^#{infos_query["user_id"]}.*$/
        end
        query = !query.nil? ? final_query.where(user_id: user_ids) : UserInfo.where(user_id: user_ids)
      end

      if infos_query["user_name"]
        if !query.nil?
          query = query.where("user_name LIKE ?", "%#{infos_query["user_name"]}%")
        else
          query = UserInfo.where("user_name LIKE ?", "%#{infos_query["user_name"]}%")
        end
      end

      final_query = query
    end

    if !final_query.nil? && !user_query.empty?
      final_query = final_query.where(user_id: User.where("email LIKE ?", "%#{user_query["email"]}%"))
    elsif !user_query.empty?
      final_query = UserInfo.where(user_id: User.where("email LIKE ?", "%#{user_query["email"]}%"))
    end

    if !final_query.nil? && !role_query.empty?
      final_query = final_query.where(user_role_id: UserRole.where("name LIKE ?", "%#{role_query["role"]}%"))
    elsif !role_query.empty?
      final_query = UserInfo.where(user_role_id: UserRole.where("name LIKE ?", "%#{role_query["role"]}%"))
    end

    final_query = [] if final_query.nil?

    if params[:page] && !final_query.instance_of?(Array)
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :user_id, :user_role_id, :googleid], [:user, :user_role])
    end

    render json: { filtration: final_query }
  end

  # Returns a filtered query based on the parameters passed for teachers.
  def teacher_filter
    teacher_query = {}
    params.each do |param|
      next unless param[0] == "teacher_name" || param[0] == "subject_name"
      next unless param[1] != "null" && param[1].length > 0

      teacher_query.merge!({ param[0] => param[1] })
    end

    teachers = UserInfo.where(user_role_id: UserRole.where(name: ["eduapp-teacher", "eduapp-admin-query", "eduapp-admin"]))
    final_query = nil
    filtered_users = nil
    filtered_subjects = nil

    if teacher_query["teacher_name"]
      filtered_users = teachers.where("user_name LIKE ?", "%#{teacher_query["teacher_name"]}%")
    end

    if teacher_query["subject_name"]
      filtered_subjects = Subject.where("name LIKE ?", "%#{teacher_query["subject_name"]}%")
    end

    if !filtered_users.nil? || !filtered_subjects.nil?
      users = !filtered_users.nil? ? filtered_users : teachers
      subjects = !filtered_subjects.nil? ? filtered_subjects : Subject.all

      final_query = []
      users.each do |u|
        subjects.each do |s|
          next if final_query.include?({ user: u, subject: s })
          final_query << { user: u, subject: s } if u.teaching_list.include? s.id
        end
      end
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = array_paginate(final_query, params[:page])
      final_query.each do |t|
        t[:user] = UserInfo.find(t[:user][:id]).serializable_hash(except: [:created_at, :updated_at, :googleid, :calendar_event, :isLoggedWithGoogle, :profile_image, :user_role_id, :user_id], include: [:user])
        t[:subject] = Subject.find(t[:subject][:id]).serializable_hash(except: [:created_at, :updated_at, :course_id, :color, :description], include: [:course])
      end if !final_query.nil?
    end

    render json: { filtration: final_query }
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

  # Adds a ```Subject``` ID to the ```UserInfo``` ```:teaching_list``` array.
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

  # Adds a ```CalendarAnnotation``` ID to the ```UserInfo``` ```:calendar_event``` array.
  def add_events
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.all
    calendar_annotation = CalendarAnnotation.where(isPop: true)

    @user_info.each do |user_info|
      calendar_annotation.each do |annotation|
        if !user_info.calendar_event.include?(annotation.id.to_s)
          user_info.calendar_event << annotation.id
        end
      end
      user_info.save
    end

    render json: @user_info
  end

  # Removes a ```CalendarAnnotation``` ID of the ```UserInfo``` ```:calendar_event``` array.
  def remove_event
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.where(user_id: params[:user_id]).first
    @user_info.calendar_event.delete(CalendarAnnotation.find(params[:calendar_event]).id)
    @user_info.save
    render json: @user_info
  end

  # Removes a ```Subject``` ID of the ```UserInfo``` ```:teaching_list``` array.
  def remove_subject
    if !check_perms_write!(get_user_roles.perms_users)
      return
    end
    @user_info = UserInfo.where(user_id: params[:user_id]).first
    @user_info.teaching_list.delete(Subject.find(params[:subject_id]).id)
    @user_info.save
    render json: @user_info
  end

  # PUT /user_infos/1
  def update
    if !can_update_self(@user_info.user_id)
      if !check_perms_update!(get_user_roles.perms_users)
        return
      end
    end

    if @user_info.update(user_info_params)
      @user_info.profile_image.recreate_versions!
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

  # Completely removes a ```User``` with it's respective
  # ```Tuition```, ```JtiMatchList``` and ```UserInfo``` linked entries.
  def destroyuser
    if !check_perms_delete!(get_user_roles.perms_users, true, params[:id])
      return
    end
    user = User.find(params[:id])
    user_i = UserInfo.find_by(user_id: params[:id])

    # Cannot delete a user if he's the last administrator.
    if UserInfo.where(user_role_id: get_admin_role.id).count === 1 && user_i.user_role_id === get_admin_role.id
      render json: { message: "Cannot delete the last admin." }, status: 403 and return
    end

    JtiMatchList.where(user_id: params[:id]).each do |jti|
      jti.destroy
    end

    Tuition.where(user_id: params[:id]).each do |tuition|
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

  # Tests if the requester id and the current ```User``` IDs are the same.
  def can_update_self(requester_id)
    return true if requester_id === @current_user
    return false
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_user_info
    @user_info = UserInfo.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_info_params
    params.permit(:extras, :user_name, :user_id, :user_role, :calendar_event, :profile_image, :teaching_list, :googleid, :isLoggedWithGoogle)
  end
end
