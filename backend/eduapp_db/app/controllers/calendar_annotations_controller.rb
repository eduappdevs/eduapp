class CalendarAnnotationsController < ApplicationController
  before_action :set_calendar_annotation, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /calendar_annotations
  def index
    wants_event_for_calendar = false

    # Returns events in a way for it to be readable by the App's calendar.
    if params[:user_id]
      wants_event_for_calendar = true
      if !check_perms_query_self!(get_user_roles.perms_events, params[:user_id])
        return
      end
      # TODO: Possible refactorization:
      # tuitions = Tuition.where(user_id: params[:user_id]).pluck(:course_id)
      # @subjects = Subject.where(course_id: tuitions)
      # @sessions = CalendarAnnotation.where(subject_id: @subjects)
      # @calendarEvents = @sessions.where(isGlobal: false)
      # @colorEvents = @subjects.pluck(:id, :color)

      @TuitionsUserId = SubjectsUser.where(user_id: params[:user_id]).pluck(:subject_id)
      @calendar_isGlobal = CalendarAnnotation.where(isGlobal: true)
      @subjects = []
      @calendarEvents = []
      @sessions = []
      for course in @TuitionsUserId
        @subjects += Subject.where(id: course).pluck(:id)
      end

      for subject in @subjects
        @calendarEvents += CalendarAnnotation.where(isGlobal: false, subject_id: subject)
        @colorEvents = Subject.where(id: @TuitionsUserId).pluck(:id, :color)
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

    if !wants_event_for_calendar
      if !params[:order].nil? && Base64.decode64(params[:order]) != "null"
        @calendar_annotations = @calendar_annotations.order(parse_filter_order(params[:order]))
      else
        @calendar_annotations = @calendar_annotations.order(annotation_title: :asc)
      end
    end

    if !wants_event_for_calendar
      if params[:page]
        @calendar_annotations = query_paginate(@calendar_annotations, params[:page])
        @calendar_annotations[:current_page] = serialize_each(@calendar_annotations[:current_page], [:created_at, :updated_at, :user_id, :subject_id], [:subject, :user])
      end
    end

    render json: @calendar_annotations
  end

  def calendar_info
    if !check_perms_query_self!(get_user_roles.perms_events, params[:user_id])
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

  # Returns a filtered query based on the parameters passed.
  def filter
    events_query = {}
    subject_query = {}
    params.each do |param|
      next if param[0] == "controller" || param[0] == "action" || param[0] == "extras" || param[0] == "calendar_annotations"
      next unless param[1] != "null" && param[1].length > 0

      query = { param[0] => param[1] }
      case param[0]
      when "id", "annotation_title", "annotation_description", "event_author"
        events_query.merge!(query)
      when "subject_name"
        subject_query.merge!(query)
      end
    end

    final_query = nil

    if !events_query.empty?
      query = nil

      if events_query["id"]
        ids = []
        CalendarAnnotation.all.each do |e|
          ids << e.id if e.id.to_s =~ /^#{events_query["id"]}.*$/
        end
        query = CalendarAnnotation.where(id: ids)
      end

      if events_query["annotation_title"]
        if !query.nil?
          query = query.where("annotation_title LIKE ?", "%#{events_query["annotation_title"]}%")
        else
          query = CalendarAnnotation.where("annotation_title LIKE ?", "%#{events_query["annotation_title"]}%")
        end
      end

      if events_query["annotation_description"]
        if !query.nil?
          query = query.where("annotation_description LIKE ?", "%#{events_query["annotation_description"]}%")
        else
          query = CalendarAnnotation.where("annotation_description LIKE ?", "%#{events_query["annotation_description"]}%")
        end
      end

      if events_query["event_author"]
        if !query.nil?
          query = query.where(user_id: User.where("email LIKE ?", "%#{events_query["event_author"]}%"))
        else
          query = CalendarAnnotation.where(user_id: User.where("email LIKE ?", "%#{events_query["event_author"]}%"))
        end
      end

      final_query = query
    end

    if !final_query.nil? && !subject_query.empty?
      final_query = final_query.where(subject_id: Subject.where("name LIKE ?", "%#{subject_query["subject_name"]}%"))
    elsif !subject_query.empty?
      final_query = CalendarAnnotation.where(subject_id: Subject.where("name LIKE ?", "%#{subject_query["subject_name"]}%"))
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :subject_id], [:subject])
    end

    render json: { filtration: final_query }
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

  # PUT /calendar_annotations/1
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
    params.require(:calendar_annotation).permit(:annotation_start_date, :annotation_end_date, :annotation_title, :annotation_description, :isGlobal, :isPop, :user_id, :subject_id)
  end
end
