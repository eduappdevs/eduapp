class InstitutionsController < ApplicationController
  before_action :set_institution, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :check_role!

  # GET /institutions
  def index
    if !check_perms_all!(get_user_roles.perms_institution)
      return
    end
    @institutions = Institution.all

    if params[:page]
      @institutions = query_paginate(@institutions, params[:page])
    end

    render json: @institutions
  end

  # GET /institutions/1
  def show
    render json: @institution
  end

  # POST /institutions
  def create
    if !check_perms_query!(get_user_roles.perms_institution)
      return
    end
    @institution = Institution.new(institution_params)

    if @institution.save
      render json: @institution, status: :created, location: @institution
    else
      render json: @institution.errors, status: :unprocessable_entity
    end
  end

  # PUT /institutions/1
  def update
    if !check_perms_update!(get_user_roles.perms_institution, false, :null)
      return
    end
    if @institution.update(institution_params)
      render json: @institution
    else
      render json: @institution.errors, status: :unprocessable_entity
    end
  end

  # DELETE /institutions/1
  def destroy
    if !check_perms_delete!(get_user_roles.perms_institution, false, :null)
      return
    end
    @institution.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_institution
    @institution = Institution.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def institution_params
    params.permit(:name)
  end
end
