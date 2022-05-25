class CoursesController < ApplicationController
  before_action :set_course, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /courses
  def index
    if params[:user_id]
      if !check_perms_query_self!(get_user_roles.perms_course, params[:user_id])
        return
      end
      @courses = []
      @TuitionsUserId = Tuition.where(user_id: params[:user_id]).pluck(:course_id)
      for course in @TuitionsUserId
        @courses += Course.where(id: course)
      end
    elsif params[:name]
      # TODO: HANDLE PERMISSIONS FOR NAME QUERIES
      @courses = Course.where(name: params[:name]).first
    else
      if !check_perms_all!(get_user_roles.perms_course)
        return
      end
      @courses = Course.all
    end

    render json: @courses
  end

  # GET /courses/1
  def show
    if !check_perms_query!(get_user_roles.perms_course)
      return
    end
    render json: @course
  end

  # POST /courses
  def create
    if !check_perms_write!(get_user_roles.perms_course)
      return
    end
    @course = Course.new(course_params)

    if @course.save
      render json: @course, status: :created, location: @course
    else
      render json: @course.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /courses/1
  def update
    if !check_perms_update!(get_user_roles.perms_course, false, :null)
      return
    end
    if @course.update(course_params)
      render json: @course
    else
      render json: @course.errors, status: :unprocessable_entity
    end
  end

  # DELETE /courses/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_course, false, :null)
      return
    end
    @course.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_course
    @course = Course.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def course_params
    params.permit(:institution_id, :name)
  end
end
