class Users::SessionsController < Devise::SessionsController
  skip_before_action :verify_signed_out_user, only: :destroy

  respond_to :json

  def new
    render json: { error: "Method not allowed" }, status: 405 and return
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?

    @user_info = UserInfo.where(user_id: resource.id).first.serializable_hash(:include => [:user, :user_role], :except => [:user_role_id, :googleid, :created_at, :updated_at])
    respond_with @user_info
  end

  def destroy
    if !request.headers["eduauth"].present?
      render json: { error: "No auth provided." }, status: :unauthorized and return
    end

    unlockedToken = User.unlock_token(request.headers["eduauth"].split("Bearer ").last)
    if unlockedToken.instance_of? Array
      jtiOwner = JtiMatchList.where(jti: unlockedToken[0]["jti"]).first
      if jtiOwner.present?
        newToken = User.revoke_token(jtiOwner.user_id, request.remote_ip)
        if newToken === true
          signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
          set_flash_message! :notice, :signed_out if signed_out
          yield if block_given?
          respond_to_on_destroy
        else
          render json: { errors: "Couldn't revoke token." }, status: :unprocessable_entity
        end
      else
        render json: { errors: "Couldn't find token." }, status: 401
      end
    else
      render json: { errors: "Invalid token." }, status: :forbidden
    end
  end

  private

  def respond_with(resource, _opts = {})
    token = User.generate_token(resource, request.remote_ip)

    headers["EduAuth"] = "Bearer #{token}"
    headers["Access-Control-Allow-Origin"] = "*"
    headers["Access-Control-Allow-Methods"] = "POST, PUT, DELETE, GET, OPTIONS"
    headers["Access-Control-Request-Method"] = "*"
    headers["Access-Control-Expose-Headers"] = "*"
    headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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
    render json: { message: "Couldn't logout the user." }, status: :unauthorized
  end
end
