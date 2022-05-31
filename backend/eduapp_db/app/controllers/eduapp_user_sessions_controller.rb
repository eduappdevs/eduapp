class EduappUserSessionsController < ApplicationController
  before_action :set_eduapp_user_session, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  require "date"
  require "securerandom"

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

    if params[:page]
      @eduapp_user_sessions = query_paginate(@eduapp_user_sessions, params[:page])
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

    if @eduapp_user_session.update(session_name: params[:session_name],
                                   session_start_date: params[:session_start_date],
                                   session_end_date: params[:session_end_date],
                                   streaming_platform: params[:streaming_platform],
                                   resources_platform: params[:resources_platform],
                                   session_chat_id: params[:session_chat_id],
                                   subject_id: params[:subject_id], batch_id: nil)
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

  def destroy_batch
    EduappUserSession.where(batch_id: params[:batch_id]).destroy_all
  end

  def session_batch_load
    days_added = 0
    weeks_passed = 0
    week_days_passed = 1
    first_week = true

    new_session_days = []
    cursor_date = params[:session_start_date].split("T")[0].to_date - 1
    last_cursor_date = cursor_date

    while days_added <= params[:diff_days]
      if !first_week
        if params[:week_repeat] > 0
          if cursor_date.strftime("%U").to_i != last_cursor_date.strftime("%U").to_i
            weeks_passed = 0 if weeks_passed >= params[:week_repeat]
            weeks_passed += 1
            if weeks_passed < params[:week_repeat]
              cursor_date = cursor_date + 7
              if cursor_date > params[:session_end_date].split("T")[0].to_date
                break
              end
              next
            end
          end
        end
      end

      if (params[:check_week_days][0] && cursor_date.monday?)
        new_session_days.append(cursor_date)
      end
      if (params[:check_week_days][1] && cursor_date.tuesday?)
        new_session_days.append(cursor_date)
      end
      if (params[:check_week_days][2] && cursor_date.wednesday?)
        new_session_days.append(cursor_date)
      end
      if (params[:check_week_days][3] && cursor_date.thursday?)
        new_session_days.append(cursor_date)
      end
      if (params[:check_week_days][4] && cursor_date.friday?)
        new_session_days.append(cursor_date)
      end
      if (params[:check_week_days][5] && cursor_date.saturday?)
        new_session_days.append(cursor_date)
      end
      if (params[:check_week_days][6] && cursor_date.sunday?)
        new_session_days.append(cursor_date)
      end

      days_added += 1
      last_cursor_date = cursor_date
      cursor_date = cursor_date + 1
      week_days_passed += 1
      if week_days_passed > 7
        first_week = false
        week_days_passed = 0
      end
    end

    session_start_time = params[:session_start_date].split("T")[1]
    session_end_time = params[:session_end_date].split("T")[1]
    batch_id = SecureRandom.uuid

    new_session_days.each do |day|
      @eduapp_user_session = EduappUserSession.new(
        session_name: params[:session_name],
        session_start_date: day.to_s + "T" + session_start_time,
        session_end_date: day.to_s + "T" + session_end_time,
        resources_platform: params[:resources_platform],
        streaming_platform: params[:streaming_platform],
        session_chat_id: params[:session_chat_id],
        subject_id: params[:subject_id],
        batch_id: batch_id,
      )

      if !@eduapp_user_session.save
        render json: @eduapp_user_session.errors, status: :unprocessable_entity and return
      end
    end
    render json: @eduapp_user_session
  end

  def update_batch
    if params[:batch_id].nil?
      render json: { error: "No id provided" }, status: :unprocessable_entity and return
    end

    sessionIDUpdate = []

    EduappUserSession.all.each do |session|
      if session.batch_id === params[:batch_id]
        sessionIDUpdate.append(session.id)
      end
    end

    if EduappUserSession.where(id: sessionIDUpdate).update(
      session_name: params[:session_name],
      resources_platform: params[:resources_platform],
      streaming_platform: params[:streaming_platform],
      session_chat_id: params[:session_chat_id],
      subject_id: params[:subject_id].to_i,
    )
      render json: { message: "Successfully updated sessions" }
    else
      render json: { error: "Failed to update sessions" }, status: :unprocessable_entity
    end
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
    params.require(:eduapp_user_session).permit(:session_name, :session_start_date, :session_end_date, :streaming_platform, :resources_platform, :session_chat_id, :subject_id, :number_repeat, :check_week_days, :diff_days)
  end
end
