class UserInfosController < ApplicationController
  before_action :set_user_info, only: [:show, :update, :destroy]

  # GET /user_infos
  def index
    if !params[:user_id]
			@user_infos = UserInfo.all
    else
			@user_infos = UserInfo.where(user_id: params[:user_id])
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

		for tui in user_tui do
			tui.destroy
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
      params.permit(:user_name, :user_id, :profile_image , :isAdmin , :googleid , :isLoggedWithGoogle)
    end
end
