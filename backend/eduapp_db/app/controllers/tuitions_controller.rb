class TuitionsController < ApplicationController
  before_action :set_tuition, only: [:show, :update, :destroy]
	before_action :authenticate_user!

  # GET /tuitions
  def index
    @tuitions = Tuition.all

    render json: @tuitions
  end

  # GET /tuitions/1
  def show
    render json: @tuition
  end

  # POST /tuitions
  def create
    @tuition = Tuition.new(tuition_params)

    if @tuition.save
      render json: @tuition, status: :created, location: @tuition
    else
      render json: @tuition.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tuitions/1
  def update
    if @tuition.update(tuition_params)
      render json: @tuition
    else
      render json: @tuition.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tuitions/1
  def destroy
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
