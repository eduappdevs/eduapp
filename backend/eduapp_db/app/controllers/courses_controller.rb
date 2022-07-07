class CoursesController < ApplicationController
  before_action :set_course, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /courses
  def index
    is_name = false
    if params[:user_id]
      if !check_perms_query_self!(get_user_roles.perms_course, params[:user_id])
        return
      end
      @courses = Course.where(id: Tuition.where(user_id: params[:user_id]))
    elsif params[:name]
      # TODO: HANDLE PERMISSIONS FOR NAME QUERIES
      is_name = true
      @courses = Course.where(name: params[:name]).first
    else
      if !check_perms_all!(get_user_roles.perms_course)
        return
      end
      @courses = Course.all
    end

    if !is_name
      if !params[:order].nil? && Base64.decode64(params[:order]) != "null"
        @courses = @courses.order(parse_filter_order(params[:order]))
      else
        @courses = @courses.order(name: :asc)
      end
    end

    if params[:page]
      @courses = query_paginate(@courses, params[:page])
      @courses[:current_page] = serialize_each(@courses[:current_page], [:created_at, :updated_at, :institution_id], [:institution])
    end

    render json: @courses
  end

  def filter
    course_query = {}
    params.each do |param|
      next unless param[0] == "id" || param[0] == "name"
      next unless param[1] != "null" && param[1].length > 0

      course_query.merge!({ param[0] => param[1] })
    end

    final_query = params[:extras] ? filter_extrafields(params[:extras], Course) : nil

    if course_query["id"]
      ids = []
      Course.all.each do |c|
        ids << c.id if c.id.to_s =~ /^#{course_query["id"]}.*$/
      end
      final_query = !final_query.nil? ? final_query.where(id: ids) : Course.where(id: ids)
    end

    if course_query["name"]
      if !final_query.nil?
        final_query = final_query.where("name LIKE ?", "%#{course_query["name"]}%")
      else
        final_query = Course.where("name LIKE ?", "%#{course_query["name"]}%")
      end
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :institution_id], [:institution])
    end

    render json: { filtration: final_query }
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
