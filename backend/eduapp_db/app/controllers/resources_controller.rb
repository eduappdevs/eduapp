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

    if params[:page]
      @resources = query_paginate(@resources, params[:page])
      @resources[:current_page] = serialize_each(@resources[:current_page], [:created_at, :updated_at, :user_id, :subject_id], [:user, :subject])
    end

    render json: @resources
  end

  def filter
    resources_query = {}
    subject_query = {}
    params.each do |param|
      next if param[0] == "controller" || param[0] == "action" || param[0] == "extras" || param[0] == "resource"
      next unless param[1] != "null" && param[1].length > 0

      query = { param[0] => param[1] }
      case param[0]
      when "id", "name", "author"
        resources_query.merge!(query)
      when "subject_name"
        subject_query.merge!(query)
      end
    end

    final_query = params[:extras] ? filter_extrafields(params[:extras], Resource) : nil

    if !resources_query.empty?
      query = nil

      if resources_query["id"]
        ids = []
        Resource.all.each do |r|
          ids << r.id if r.id.to_s =~ /^#{resources_query["id"]}.*$/
        end
        query = Resource.where(id: ids)
      end

      if resources_query["name"]
        if !query.nil?
          query = query.where("name LIKE ?", "%#{resources_query["name"]}%")
        else
          query = Resource.where("name LIKE ?", "%#{resources_query["name"]}%")
        end
      end

      if resources_query["author"]
        if !query.nil?
          query = query.where(user_id: User.where("email LIKE ?", "%#{resources_query["author"]}%"))
        else
          query = Resource.where(user_id: User.where("email LIKE ?", "%#{resources_query["author"]}%"))
        end
      end

      final_query = query
    end

    if !final_query.nil? && !subject_query.empty?
      final_query = final_query.where(subject_id: Subject.where("name LIKE ?", "%#{subject_query["subject_name"]}%"))
    elsif !subject_query.empty?
      final_query = Resource.where(subject_id: Subject.where("name LIKE ?", "%#{subject_query["subject_name"]}%"))
    end

    final_query = [] if final_query.nil?

    if params[:page]
      final_query = query_paginate(final_query, params[:page])
      final_query = serialize_each(final_query[:current_page], [:created_at, :updated_at, :user_id, :subject_id], [:user, :subject])
    end

    render json: { filtration: final_query }
  end

  # GET /resources/1
  def show
    if !resource_in_user_course && get_user_roles.name != "eduapp-admin"
      return deny_perms_access!
    end
    render json: @resource
  end

  # POST /resources
  def create
    if !check_perms_write!(get_user_roles.perms_resources)
      return
    end
    @resource = Resource.new(
      name: params[:name],
      description: params[:description],
      user_id: params[:user_id],
      subject_id: params[:subject_id],
    )

    if @resource.save
      files = []
      x = 0
      while x < 9
        files.append(resource_params["file_#{x}"]) if !resource_params["file_#{x}"].nil?
        x += 1
      end

      if files.count > 0
        @resource.files.attach(files)
        if @resource.files.attached?
          sFiles = []
          json = []
          for f in @resource.files.attachments
            sFiles.append(url_for(f))
            json.append(f.to_json)
          end
          @resource.resource_files = sFiles
          @resource.resource_files_json = json
          if @resource.save
            render json: @resource, status: :created, location: @resource and return
          else
            render json: @resource.errors, status: :unprocessable_entity and return
          end
        end
      end
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

    if @resource.update(name: params[:name], description: params[:description], resource_files: params[:resource_files], resource_files_json: params[:resource_files_json], blob_id_delete: params[:blob_id_delete], subject_id: params[:subject_id])
      for idDelete in params[:blob_id_delete]
        @resource.files.find(idDelete).purge
      end
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
    if @resource.files.attached?
      @resource.files.attachments.each do |attachment|
        attachment.purge
      end
    end
    @resource.destroy
  end

  private

  # Only allow a list of trusted parameters through.
  def resource_params
    permits = [:id, :name, :description, :blob_id_delete, :user_id, :subject_id]

    x = 0
    while x < 10
      permits.append("file_#{x}")
      x += 1
    end
    params.permit(permits)
  end

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
end
