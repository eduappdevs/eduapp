class ResourcesController < ApplicationController
  before_action :set_resource, only: [:show , :update, :destroy]

  # GET /resources
  def index
		if !params[:subject_id]
			@resources = Resource.all
      render json: @resources
		else
        @Resources = Resource.order(created_at: :desc).where(subject_id: params[:subject_id])
      render json: @Resources
		end
  end

  # GET /resources/1
  def show
    render json: @resource
  end

  # POST /resources
  def create
    @resource = Resource.new(name: params[:name], description: params[:description], createdBy: params[:createdBy], subject_id: params[:subject_id])

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
    if @resource.update(name: params[:name], description: params[:description], resource_files: params[:resource_files], resource_files_json: params[:resource_files_json], blob_id_delete: params[:blob_id_delete], subject_id: params[:subject_id])
      for idDelete in params[:blob_id_delete]
        @resource.files.find(idDelete).purge
      end
        render json: @resource      
    else
      render json: @resource.errors
    end
  end

  # DELETE /resources/1
  def destroy
    @resource.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_resource
      @resource = Resource.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def resource_params
      permits = [:id, :name,:description,:blob_id_delete, :createdBy,:subject_id]

      x = 0
      while x < 10
        permits.append("file_#{x}")
        x += 1
      end
      params.permit(permits)
    end
end