class UserInfosController < ApplicationController
  before_action :set_user_info, only: [:show, :update, :destroy]
	before_action :authenticate_user!

  # GET /user_infos
  def index
		if params[:user_id]
			@user_infos = UserInfo.where(user_id: params[:user_id])
		elsif params[:name]
			@user_infos = UserInfo.search_name(params[:name]).take(3)
		else
			@user_infos = UserInfo.all
		end

    render json: @user_infos
  end

  # GET /user_infos/1
  def show
    render json: @user_info
  end

  # POST /user_infos
  def create
    @user_info = UserInfo.new(user_info_params)

    if @user_info.save
      render json: @user_info, status: :created, location: @user_info
    else
      render json: @user_info.errors, status: :unprocessable_entity
    end
  end

	def add_subject
		@user_info = UserInfo.where(user_id: params[:user_id]).first
		puts @user_info.to_json
		puts "\n\n\n#{Subject.find(params[:subject_id]).id}"
		@user_info.teaching_list << Subject.find(params[:subject_id]).id
		@user_info.save
		render json: @user_info
	end

	def remove_subject
		@user_info = UserInfo.where(user_id: params[:user_id]).first
		@user_info.teaching_list.delete(Subject.find(id: params[:subject_id]).id)
		@user_info.save
		render json: @user_info
	end

  # PATCH/PUT /user_infos/1
  def update
    if @user_info.update(user_info_params)
      render json: @user_info
    else
      render json: @user_info.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_infos/1
  def destroy
    @user_info.destroy
  end

	def destroyuser
		user = User.find(params[:id])
		user_i = UserInfo.find_by(user_id: params[:id])
		user_tui = Tuition.where(user_id: params[:id])
		user_jtis = JtiMatchList.where(user_id: params[:id])

		if UserInfo.where(isAdmin: true).count == 1 && user_i.isAdmin
			render json: { message: "Cannot delete the last admin." }, status: 403
			return
		end

		user_jtis.each do |jti|
			jti.destroy
		end

		user_tui.each do |tuition|
			tuition.destroy
		end

		if user_i.destroy
			if user.destroy
				render json: { message: "Deleted user successfully." }, status: :ok
			else
				render json: { message: "Couldn't delete user"}, status: 500
			end	
		else
			render json: { message: "Couldn't delete user info"}, status: 500
		end
	end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_info
      @user_info = UserInfo.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_info_params
      params.permit(:user_name, :user_id, :profile_image, :teaching_list, :isAdmin, :isTeacher , :googleid , :isLoggedWithGoogle)
    end
end
