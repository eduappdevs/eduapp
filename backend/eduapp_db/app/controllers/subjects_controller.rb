class SubjectsController < ApplicationController
  before_action :set_subject, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /subjects
  def index
    wants_info_for_calendar = false || params[:wants_info_for_calendar]

    if params[:user_id] # this is used by calendar frontend when adding event
      wants_info_for_calendar = true
      if !check_perms_query_self!(get_user_roles.perms_subjects, params[:user_id])
        return
      end
      user = User.find(params[:user_id])
      teaching_subjects = user.user_info.teaching_list || []
      attending_subjects = user.subjects.map { |s| s.id } || []

      @subjects = Subject.where(id: teaching_subjects + attending_subjects)
    elsif params[:all_sessions] # This is used by frontend index for showing all sessions in the day which hasn't ended yet. Next session is the first one
      user = User.find(current_user)
      if user.user_info.user_role.name == 'eduapp-teacher'
        @user_subjects = user.user_info.teaching_list
      else
        @user_subjects = user.subjects.pluck(:id)
      end

      current_date = Time.zone.now.strftime('%Y-%m-%dT%H:%M')
      tomorrow = Date.tomorrow.strftime('%Y-%m-%d')
      @subjects = EduappUserSession.where("subject_id in (?) AND session_end_date > ? AND session_end_date < ?", @user_subjects, current_date, tomorrow).order(session_end_date: :asc)
    elsif params[:subject_id]
      @subjects = Subject.where(id: params[:subject_id])
    elsif params[:name]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @subjects = Subject.where('name ilike ?', "%#{params[:name]}%")
    elsif params[:subject_code]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @subjects = Subject.where('subject_code ilike ?', "%#{params[:subject_code]}%")
    elsif params[:id]
      # TODO: HANDLE PERMISSIONS FOR NAME QUERIES
      @subjects = Subject.where('id::text ilike ?', "%#{params[:id]}%")
    elsif params[:user]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @subjects = Subject.where(course_id: Tuition.where(user_id: params[:user]).pluck(:course_id))
    elsif params[:course_name]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @subjects = Subject.joins(:course).where('courses.name ilike ?', "%#{params[:course_name]}%")
    else
      if !check_perms_all!(get_user_roles.perms_subjects)
        return
      end
      @subjects = Subject
    end

    #if wants_info_for_calendar #Commented this condition to allow ordering in admin
    if !params[:all_sessions]
      order = !params[:order].nil? && JSON.parse(Base64.decode64(params[:order]))
      if order && order["field"] != ""
        if order["field"] == 'course_name'
          @subjects = @subjects.joins(:course)
        end
        @subjects = @subjects.order(parse_filter_order(order,{'course_name' => 'courses.name'}))
      elsif !@subjects.is_a?(Array)
        @subjects = @subjects.order(name: :asc)
      end
    end

    if params[:page]
      @subjects = query_paginate(@subjects, params[:page])
      @subjects[:current_page] = serialize_each(@subjects[:current_page], [:created_at, :updated_at], [:course, :users])
    end

    render json: @subjects
  end

  # Returns a filtered query based on the parameters passed.
  def filter
    subjects_query = {}
    course_query = {}
    params.each do |param|
      next if param[0] == "controller" || param[0] == "action" || param[0] == "extras" || param[0] == "subject"
      next unless param[1] != "null" && param[1].length > 0

      query = { param[0] => param[1] }
      case param[0]
      when "id", "name", "subject_code"
        subjects_query.merge!(query)
      when "course_name"
        course_query.merge!(query)
      end
    end

    final_query = params[:extras] ? filter_extrafields(params[:extras], Subject) : nil

    if !subjects_query.empty?
      query = !final_query.nil? ? final_query : nil

      if subjects_query["id"]
        ids = []
        Subject.all.each do |s|
          ids << s.id if s.id.to_s =~ /^#{subjects_query["id"]}.*$/
        end
        query = Subject.where(id: ids)
      end

      if subjects_query["name"]
        if !query.nil?
          query = query.where("name LIKE ?", "%#{subjects_query["name"]}%")
        else
          query = Subject.where("name LIKE ?", "%#{subjects_query["name"]}%")
        end
      end

      if subjects_query["subject_code"]
        if !query.nil?
          query = query.where("subject_code LIKE ?", "%#{subjects_query["subject_code"]}%")
        else
          query = Subject.where("subject_code LIKE ?", "%#{subjects_query["subject_code"]}%")
        end
      end

      final_query = query
    end

    if !final_query.nil? && !course_query.empty?
      final_query = final_query.where(course_id: Course.where("name LIKE ?", "%#{course_query["course_name"]}%"))
    elsif !course_query.empty?
      final_query = Subject.where(course_id: Course.where("name LIKE ?", "%#{course_query["course_name"]}%"))
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :course_id], [:course])
    end

    render json: { filtration: final_query }
  end

  # GET /subjects/1
  #TODO: probar pasar un parametro render(boolean) para controlar los render anidados
  def show
    if !check_perms_query!(get_user_roles.perms_subjects, false) && !check_perms_query_self!(get_user_roles.perms_subjects, current_user)
      deny_perms_access!
      return
    end
    render json: @subject
  end

  # POST /subjects
  def create
    if !check_perms_write!(get_user_roles.perms_subjects)
      return
    end

    if Subject.where(subject_code: params[:subject_code]).count > 0
      render json: @Subject, status: :unprocessable_entity
    elsif params[:enrollment] # TODO: refactor crear una acción
      @subject = Subject.find(params[:subject_id])
      @subject.users << User.find(params[:user_id])
      @subject.save
    else
      @subject = Subject.new(subject_code: params[:subject_code], 
                            external_id: params[:external_id], name: params[:name],
                            description: params[:description], color: params[:color],
                            course_id: params[:course_id], chat_link: params[:chat_link])
      if @subject.save
        render json: @subject, status: :created, location: @subject
      else
        render json: @subject.errors, status: :unprocessable_entity
      end
    end
  end

  # PUT /subjects/1
  def update
    if !check_perms_update!(get_user_roles.perms_subjects, true, current_user, false)
      return
    end
    if @subject.update(subject_params)
      render json: @subject
    else
      render json: @subject.errors, status: :unprocessable_entity
    end
  end

  # DELETE /subjects/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_subjects, false, :null)
      return
    end
    @subject.destroy
  end

  # DELETE /subjects/1/users/1
  def destroy_user
    if !check_perms_delete!(get_user_roles.perms_subjects, false, :null)
      return
    end
    @subject = Subject.find(params[:subject_id])
    @subject.users.destroy(params[:user_id])
  end

  private

  # Checks if ```Subject``` is present in the user's ```Course```.
  def subject_in_user_course
    if Tuition.where(user_id: @current_user, course_id: @subject.course_id).count > 0
      return true
    end
    return false
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_subject
    @subject = Subject.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def subject_params
    params.require(:subject)
          .permit(
            :id,
            :subject_code,
            :external_id,
            :name,
            :description,
            :color,
            :chat_link,
            :course_id
          )
  end
end
