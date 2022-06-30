class CalendarAnnotationsController < ApplicationController
  before_action :set_calendar_annotation, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /calendar_annotations
  def index
    if params[:user_id]
      if !check_perms_query_self!(get_user_roles.perms_events, params[:user_id])
        return
      end
      @TuitionsUserId = Tuition.where(user_id: params[:user_id]).pluck(:course_id)
      @calendar_isGlobal = CalendarAnnotation.where(isGlobal: true)
      @subjects = []
      @calendarEvents = []
      @sessions = []
      for course in @TuitionsUserId
        @subjects += Subject.where(course_id: course).pluck(:id)
      end

      for subject in @subjects
        @calendarEvents += CalendarAnnotation.where(isGlobal: false, subject_id: subject)
        @colorEvents = Subject.where(course_id: @TuitionsUserId).pluck(:id, :color)
      end

      for subject in @subjects
        @sessions += EduappUserSession.where(subject_id: subject)
      end
      @calendar_annotations = { :globalEvents => @calendar_isGlobal, :calendarEvents => @calendarEvents, :sessions => @sessions, :colorEvents => @colorEvents }
    else
      if !check_perms_all!(get_user_roles.perms_events)
        return
      end
      @calendar_annotations = CalendarAnnotation.all
    end

    if params[:page]
      @calendar_annotations = query_paginate(@calendar_annotations, params[:page])
      @calendar_annotations[:current_page] = serialize_each(@calendar_annotations[:current_page], [:created_at, :updated_at, :user_id, :subject_id], [ :subject, :user,])
    end

    render json: @calendar_annotations
  end

  def calendar_info
    if !check_perms_query!(get_user_roles.perms_events)
      return
    end
    annotation = CalendarAnnotation.where(isGlobal: true, isPop: true).order(:created_at).pluck(:annotation_start_date, :annotation_end_date)
    now = Time.now.to_i
    event = []
    for date in annotation
      stime = date[0].to_time.to_i
      etime = date[1].to_time.to_i
      if stime > now or now < etime
        event += CalendarAnnotation.where(annotation_start_date: date[0], annotation_end_date: date[1])
      end
    end
    render json: event
  end

  # GET /calendar_annotations/1
  def show
    if !check_perms_query!(get_user_roles.perms_events)
      return
    end
    render json: @calendar_annotation
  end

  def show_calendar_event
    if !check_perms_query!(get_user_roles.perms_events)
      return
    end
    calendar_annotation = CalendarAnnotation.where(isPop: true).last
    render json: calendar_annotation
  end

  # POST /calendar_annotations
  def create
    if !check_perms_write!(get_user_roles.perms_events)
      return
    end
    @calendar_annotation = CalendarAnnotation.new(calendar_annotation_params)

    if @calendar_annotation.save
      render json: @calendar_annotation, status: :created, location: @calendar_annotation
    else
      render json: @calendar_annotation.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /calendar_annotations/1
  def update
    if !check_perms_update!(get_user_roles.perms_events, false, :null)
      return
    end
    puts "A: #{calendar_annotation_params}"
    if @calendar_annotation.update(calendar_annotation_params)
      render json: @calendar_annotation
    else
      render json: @calendar_annotation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /calendar_annotations/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_events, false, :null)
      return
    end
    @calendar_annotation.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_calendar_annotation
    @calendar_annotation = CalendarAnnotation.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def calendar_annotation_params
    params.require(:calendar_annotation).permit(:annotation_start_date, :annotation_end_date, :annotation_title, :annotation_description, :isGlobal, :isPop,  :user_id, :subject_id)
  end
end
