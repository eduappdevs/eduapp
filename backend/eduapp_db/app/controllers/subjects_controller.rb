class SubjectsController < ApplicationController
  before_action :set_subject, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /subjects
  def index
    wants_info_for_calendar = false

    if params[:user_id]
      wants_info_for_calendar = true
      if !check_perms_query_self!(get_user_roles.perms_subjects, params[:user_id])
        return
      end

      now = Time.now.to_i
      tuitions = Tuition.where(user_id: params[:user_id]).pluck(:course_id)
      @Subjects = Subject.where(course_id: tuitions)
      @todaySessions = EduappUserSession.where(subject_id: @Subjects).pluck(:session_start_date, :session_end_date, :id)
      @Sessions = []
      for hour in @todaySessions
        stime = hour[0].to_time.to_i
        etime = hour[1].to_time.to_i
        id = hour[2]
        if stime >= now or now <= etime
          @Sessions += EduappUserSession.where(id: id)
        end
      end

      @subjects = @Sessions
    elsif params[:name]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @subjects = Subject.where(name: params[:name])
    elsif params[:user]
      # TODO: HANDLE PERMISSIONS FOR CHAINED SUBJECT QUERIES
      @subjects = Subject.where(course_id: Tuition.where(user_id: params[:user]).pluck(:course_id))
    else
      if !check_perms_all!(get_user_roles.perms_subjects)
        return
      end
      @subjects = Subject.all
    end

    if !wants_info_for_calendar
      if !params[:order].nil? && Base64.decode64(params[:order]) != "null"
        @subjects = @subjects.order(parse_filter_order(params[:order]))
      else
        @subjects = @subjects.order(name: :asc)
      end
    end

    if params[:page]
      @subjects = query_paginate(@subjects, params[:page])
      @subjects[:current_page] = serialize_each(@subjects[:current_page], [:created_at, :updated_at, :course], [:course])
    end

    render json: @subjects
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
