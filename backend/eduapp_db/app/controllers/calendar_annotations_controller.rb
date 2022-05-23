class CalendarAnnotationsController < ApplicationController
  before_action :set_calendar_annotation, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /calendar_annotations
  def index
    if !params[:user_id]
      @calendar_annotations = CalendarAnnotation.all
      render json: @calendar_annotations
    else
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
      render :json => { :globalEvents => @calendar_isGlobal, :calendarEvents => @calendarEvents, :sessions => @sessions, :colorEvents => @colorEvents }
    end
  end

  # GET /calendar_annotations/1
  def show
    render json: @calendar_annotation
  end

  # POST /calendar_annotations
  def create
    @calendar_annotation = CalendarAnnotation.new(calendar_annotation_params)

    if @calendar_annotation.save
      render json: @calendar_annotation, status: :created, location: @calendar_annotation
    else
      render json: @calendar_annotation.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /calendar_annotations/1
  def update
    if @calendar_annotation.update(calendar_annotation_params)
      render json: @calendar_annotation
    else
      render json: @calendar_annotation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /calendar_annotations/1
  def destroy
    @calendar_annotation.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_calendar_annotation
    @calendar_annotation = CalendarAnnotation.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def calendar_annotation_params
    params.require(:calendar_annotation).permit(:annotation_start_date, :annotation_end_date, :annotation_title, :annotation_description, :isGlobal, :user_id, :subject_id)
  end
end
