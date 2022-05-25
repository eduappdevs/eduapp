class ResourcesController < ApplicationController
  before_action :set_resource, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /resources
  def index
    if params[:subject_id]
      if !subject_in_user_course(params[:subject_id])
        return deny_perms_access!
      end
      @resources = Resource.order(created_at: :desc).where(subject_id: params[:subject_id])
    else
      if !check_perms_all!(get_user_roles.perms_resources)
        return
      end
      @resources = Resource.all
    end

    render json: @resources
  end

  # GET /resources/1
  def show
    if !resource_in_user_course
      return deny_perms_access!
    end
    render json: @resource
  end

  # POST /resources
  def create
    if !check_perms_write!(get_user_roles.perms_resources)
      return
    end
    @resource = Resource.new(resource_params)

    if @resource.save
      render json: @resource, status: :created, location: @resource
    else
      render json: @resource.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /resources/1
  def update
    if !check_perms_update!(get_user_roles.perms_resources, true, @resource.user_id)
      return
    end

    if @resource.update(resource_params)
      render json: @resource
    else
      render json: @resource.errors, status: :unprocessable_entity
    end
  end

  # DELETE /resources/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_resources, true, @resource.user_id)
      return
    end
    @resource.destroy
  end

  private

  def subject_in_user_course(s_id)
    c_id = Subject.find(s_id).course_id
    if Tuition.where(user_id: @current_user, course_id: c_id).count > 0
      return true
    end
    return false
  end

  def resource_in_user_course
    c_id = Subject.find(@resource.subject_id).course_id
    if Tuition.where(user_id: @current_user, course_id: c_id).count > 0
      return true
    end
    return false
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_resource
    @resource = Resource.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def resource_params
    params.permit(:name, :description, :firstfile, :secondfile, :thirdfile, :user_id, :subject_id)
  end
end
