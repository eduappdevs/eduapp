class Users::SessionsController < Devise::SessionsController

    respond_to :json

		def create
			self.resource = warden.authenticate!(auth_options)
			set_flash_message!(:notice, :signed_in)
			sign_in(resource_name, resource)
			yield resource if block_given?
			@user_info = UserInfo.where(user_id: resource.id).first
			@user_info = JSON.parse(@user_info.to_json)
			@user_info = @user_info.merge({user: resource})
			respond_with @user_info
		end
  
    private

    def respond_with(resource, _opts = {})
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
      headers['Access-Control-Request-Method'] = '*'
      headers['Access-Control-Expose-Headers'] = '*'
      headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      render json: { message: resource, headers: response.headers }, status: :ok
    end

    def respond_to_on_destroy
      log_out_success && return if current_user
  
      log_out_failure
    end

    def log_out_success
      render json: { message: "You have logged out." }, status: :ok
    end

    def log_out_failure
      render json: { message: "Couldn't logout the user."}, status: :unauthorized
    end
  end