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
    @tuition = Tuition.new(tuition_params)

    if @tuition.save
      render json: @tuition, status: :created, location: @tuition
    else
      render json: @tuition.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tuitions/1
  def update
    if !check_perms_update!(get_user_roles.perms_tuitions)
      return
    end

    if @tuition.update(tuition_params)
      render json: @tuition
    else
      render json: @tuition.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tuitions/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_tuitions)
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
    params.permit(:course_id, :user_id)
  end
end
