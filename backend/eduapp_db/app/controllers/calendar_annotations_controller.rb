class CalendarAnnotationsController < ApplicationController
  before_action :set_calendar_annotation, only: [:show, :update, :destroy]

  # GET /calendar_annotations
  def index
    @calendar_annotations = CalendarAnnotation.all

    render json: @calendar_annotations
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
      params.require(:calendar_annotation).permit(:annotation_date_start,:annotation_date_end, :annotation_title, :annotation_description,:location, :isGlobal, :user_id)
    end
end
