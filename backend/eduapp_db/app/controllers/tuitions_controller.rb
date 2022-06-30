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
      @tuitions[:current_page] = serialize_each(@tuitions[:current_page], [:created_at, :updated_at, :course, :user_id], [ :course, :user])

    end

    render json: @tuitions
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
