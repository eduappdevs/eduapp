class SubjectsController < ApplicationController
  before_action :set_subject, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /subjects
  def index
    if params[:user_id]
      if !check_perms_query_self!(get_user_roles.perms_subjects, params[:user_id])
        return
      end
      @Subjects = []
      @Sessions = []
      @Today = Time.now.strftime("%F")
      @TodayHourNow = Time.now.strftime("%H")
      @todaySessions = []

      @TuitionsUserId = Tuition.where(user_id: params[:user_id]).pluck(:course_id)

      for course in @TuitionsUserId
        @Subjects += Subject.where(course_id: course)
      end

      for subject in @Subjects
        @todaySessions += EduappUserSession.where(subject_id: subject).pluck(:session_start_date)
      end

      for hour in @todaySessions
        if (hour.split("T")[1].split(":")[0] == @TodayHourNow or hour.split("T")[1].split(":")[0] >= @TodayHourNow and hour.split("T")[0] == @Today)
          @Sessions += EduappUserSession.where(subject_id: @Subjects, session_start_date: hour)
        else
        end
      end

      @subjects = @Sessions
    elsif params[:name]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @subjects = Subject.where(name: params[:name])
    elsif params[:user]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @TuitionsUserId = Tuition.where(user_id: params[:user]).pluck(:course_id)
      @subjects = []

      for course in @TuitionsUserId
        @subjects += Subject.where(course_id: course)
      end
    else
      if !check_perms_all!(get_user_roles.perms_subjects)
        return
      end
      @subjects = Subject.all
    end

    if params[:page]
      @subjects = query_paginate(@subjects, params[:page])
      @subjects[:current_page] = serialize_each(@subjects[:current_page], [:created_at, :updated_at, :course], [:course])
    end

    render json: @subjects
  end

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
      query = nil

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
  def show
    if !check_perms_query!(get_user_roles.perms_subjects) && !subject_in_user_course
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
    else
      puts "Creating subject: "
      @subject = Subject.new(subject_code: params[:subject_code], name: params[:name], description: params[:description], color: params[:color], course_id: params[:course_id])
      if @subject.save
        render json: @subject, status: :created, location: @subject
      else
        render json: @subject.errors, status: :unprocessable_entity
      end
    end
  end

  # PATCH/PUT /subjects/1
  def update
    if !check_perms_update!(get_user_roles.perms_subjects, false, :null)
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

  private

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
    params.require(:subject).permit(:subject_code, :name, :description, :color, :course_id)
  end
end
