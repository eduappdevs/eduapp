class EduappUserSessionsController < ApplicationController
  before_action :set_eduapp_user_session, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /eduapp_user_sessions
  def index
    if params[:subject_id]
      if !subject_in_user_course(params[:subject_id])
        return deny_perms_access!
      end
      @eduapp_user_sessions = EduappUserSession.where(subject_id: params[:subject_id])
    else
      if !check_perms_all!(get_user_roles.perms_sessions)
        return
      end
      @eduapp_user_sessions = EduappUserSession.all
    end

    render json: @eduapp_user_sessions
  end

  # GET /eduapp_user_sessions/1
  def show
    if !check_perms_query!(get_user_roles.perms_sessions)
      return
    end
    render json: @eduapp_user_session
  end

  # POST /eduapp_user_sessions
  def create
    if !check_perms_write!(get_user_roles.perms_sessions)
      return
    end
    @eduapp_user_session = EduappUserSession.new(eduapp_user_session_params)
    if @eduapp_user_session.save
      render json: @eduapp_user_session, status: :created, location: @eduapp_user_session
    else
      render json: @eduapp_user_session.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /eduapp_user_sessions/1
  def update
    if !check_perms_update!(get_user_roles.perms_sessions, false, :null)
      return
    end

    if @eduapp_user_session.update(eduapp_user_session_params)
      render json: @eduapp_user_session
    else
      render json: @eduapp_user_session.errors, status: :unprocessable_entity
    end
  end

  # DELETE /eduapp_user_sessions/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_roles, false, :null)
      return
    end
    @eduapp_user_session.destroy
  end

  private

  def subject_in_user_course(s_id)
    c_id = Subject.find(s_id).course_id
    if Tuition.where(user_id: @current_user, course_id: c_id).count > 0
      return true
    end
    return false
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_eduapp_user_session
    @eduapp_user_session = EduappUserSession.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def eduapp_user_session_params
    params.require(:eduapp_user_session).permit(:session_name, :session_start_date, :session_end_date, :streaming_platform, :resources_platform, :session_chat_id, :subject_id)
  end
end
