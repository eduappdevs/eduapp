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
      @subjects[:current_page] = serialize_each(@subjects[:current_page], [:created_at, :updated_at, :course], [ :course])
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
    @subject = Subject.new(subject_params)

    if @subject.save
      render json: @subject, status: :created, location: @subject
    else
      render json: @subject.errors, status: :unprocessable_entity
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
    params.require(:subject).permit(:name, :description, :color, :course_id)
  end
end
