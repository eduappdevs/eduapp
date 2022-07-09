class TuitionsController < ApplicationController
  before_action :set_tuition, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /tuitions
  def index
    if !check_perms_all!(get_user_roles.perms_tuitions)
      return
    end
    @tuitions = Tuition.all

    if params[:page]
      @tuitions = query_paginate(@tuitions, params[:page])
      @tuitions[:current_page] = serialize_each(@tuitions[:current_page], [:created_at, :updated_at, :course, :user_id], [:course, :user])
    end

    render json: @tuitions
  end

  def filter
    enroll_query = {}
    params.each do |param|
      next unless param[0] == "user_email" || param[0] == "course_name"
      next unless param[1] != "null" && param[1].length > 0

      enroll_query.merge!({ param[0] => param[1] })
    end

    final_query = nil

    if enroll_query["user_email"]
      final_query = Tuition.where(user_id: User.where("email LIKE ?", "%#{enroll_query["user_email"]}%"))
    end

    if enroll_query["course_name"]
      if !final_query.nil?
        final_query = final_query.where(course_id: Course.where("name LIKE ?", "%#{enroll_query["course_name"]}%"))
      else
        final_query = Tuition.where(course_id: Course.where("name LIKE ?", "%#{enroll_query["course_name"]}%"))
      end
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :user_id, :course_id], [:user, :course])
    end

    render json: { filtration: final_query }
  end

  # GET /tuitions/1
  def show
    if !check_perms_query!(get_user_roles.perms_tuitions)
      return
    end
    render json: @tuition
  end

  # POST /tuitions
  def create
    if !check_perms_write!(get_user_roles.perms_tuitions)
      return
    end

    @tuition = Tuition.new(course_id: params[:course_id], user_id: params[:user_id])
    if Tuition.where(user_id: params[:user_id], course_id: params[:course_id]).count > 0
      render json: @tuition.errors, status: :unprocessable_entity
    else
      if @tuition.save
        render json: @tuition, status: :created, location: @tuition
      else
        render json: @tuition.errors, status: :unprocessable_entity
      end
    end
  end

  # PATCH/PUT /tuitions/1
  def update
    if !check_perms_update!(get_user_roles.perms_tuitions, false, :null)
      return
    end

    if @tuition.update(course_id: params[:course_id], user_id: params[:user_id], id: params[:id])
      render json: @tuition
    else
      render json: @tuition.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tuitions/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_tuitions, false, :null)
      return
    end

    @tuition.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_tuition
    @tuition = Tuition.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def tuition_params
    params.require(:tuition).permit(:course_id, :user_id, :id)
  end
end
