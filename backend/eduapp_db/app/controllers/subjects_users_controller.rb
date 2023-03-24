class SubjectsUsersController < ApplicationController
  before_action :set_subject_user, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  def index
    if !check_perms_all!(get_user_roles.perms_tuitions)
      return
    end
    enroll_query = {}
    params.each do |param|
      next unless param[0] == "user_email" || param[0] == "subject_name"
      next unless param[1] != "null" && param[1].length > 0

      enroll_query.merge!({ param[0] => param[1] })
    end

    @subjects_users = SubjectsUser

    if params[:user_id]
      @subjects_users = SubjectsUser.where(user_id: params[:user_id])
    end

    if enroll_query["user_email"]
      @subjects_users = SubjectsUser.where(user_id: User.where("email LIKE ?", "%#{enroll_query["user_email"]}%"))
    end

    if enroll_query["subject_name"]
      @subjects_users = SubjectsUser.where(subject_id: Subject.where("name LIKE ?", "%#{enroll_query["subject_name"]}%"))
    end

    if params[:page]
      @subjects_users = query_paginate(@subjects_users, params[:page] || 1)
      @subjects_users[:current_page] = serialize_each(@subjects_users[:current_page], [:created_at, :updated_at, :subject, :user_id], [:subject, :user])
    end

    render json: @subjects_users
  end

  def filter
    enroll_query = {}
    params.each do |param|
      next unless param[0] == "user_email" || param[0] == "subject_name"
      next unless param[1] != "null" && param[1].length > 0

      enroll_query.merge!({ param[0] => param[1] })
    end

    final_query = nil

    if enroll_query["user_email"]
      final_query = SubjectsUser.where(user_id: User.where("email LIKE ?", "%#{enroll_query["user_email"]}%"))
    end

    if enroll_query["subject_name"]
      if !final_query.nil?
        final_query = final_query.where(subject_id: Subject.where("name LIKE ?", "%#{enroll_query["subject_name"]}%"))
      else
        final_query = SubjectsUser.where(subject_id: Subject.where("name LIKE ?", "%#{enroll_query["subject_name"]}%"))
      end
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :user_id, :course_id], [:user, :course])
    end

    render json: { filtration: final_query }
  end

  def show
    if !check_perms_query!(get_user_roles.perms_tuitions)
      return
    end
    render json: @subject_user
  end

  def create
    if !check_perms_write!(get_user_roles.perms_tuitions)
      return
    end

    @subject_user = SubjectsUser.new(subject_id: params[:subject_id], user_id: params[:user_id])
    if SubjectsUser.where(user_id: params[:user_id], subject_id: params[:subject_id]).count > 0
      render json: @subject_user.errors, status: :unprocessable_entity
    else
      if @subject_user.save
        render json: @subject_user, status: :created, location: @subject_user
      else
        render json: @subject_user.errors, status: :unprocessable_entity
      end
    end
  end

  def update
    if !check_perms_update!(get_user_roles.perms_tuitions, false, :null)
      return
    end

    if @subject_user.update(subject_id: params[:subject_id], user_id: params[:user_id], id: params[:id])
      render json: @subject_user
    else
      render json: @subject_user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if !check_perms_delete!(get_user_roles.perms_tuitions, false, :null)
      return
    end

    @subject_user.destroy
  end

  private

  def set_subject_user
    @subject_user = SubjectsUser.find(params[:id])
  end

  def subject_user_params
    params.require(:subject_user).permit(:subject_id, :user_id, :id)
  end
end
