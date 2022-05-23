class SubjectsController < ApplicationController
  before_action :set_subject, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /subjects
  def index
    if params[:user_id]
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

      render json: @Sessions
    elsif params[:name]
      @subjects = Subject.where(name: params[:name])
      render json: @subjects
    elsif params[:user]
      @TuitionsUserId = Tuition.where(user_id: params[:user]).pluck(:course_id)
      @Subjects = []

      for course in @TuitionsUserId
        @Subjects += Subject.where(course_id: course)
      end

      render json: @Subjects
    else
      @subjects = Subject.all
      render json: @subjects
    end
  end

  # GET /subjects/1
  def show
    render json: @subject
  end

  # POST /subjects
  def create
    @subject = Subject.new(subject_params)

    if @subject.save
      render json: @subject, status: :created, location: @subject
    else
      render json: @subject.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /subjects/1
  def update
    if @subject.update(subject_params)
      render json: @subject
    else
      render json: @subject.errors, status: :unprocessable_entity
    end
  end

  # DELETE /subjects/1
  def destroy
    @subject.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_subject
    @subject = Subject.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def subject_params
    params.require(:subject).permit(:name, :description, :color, :course_id)
  end
end
