class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def new
    return render json: { error: "Method not allowed" }, status: :method_not_allowed
  end

  def create
    if UserInfo.all.where(user_role_id: UserRole.where(name: "eduapp-admin").first.id).count > 0
      if !check_perms_write!(get_user_roles(params[:requester_id]).perms_users) || params[:requester_id].nil?
        return
      end
    end

    puts "email: #{params[:email]} ,password: #{params[:password]}"

    build_resource({ email: params[:email], password: params[:password] })

    begin
      resource.save
    rescue ActiveRecord::RecordNotUnique => ex
      render json: { errors: ex.message }, status: :unprocessable_entity
      return
    end

    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
    end

    if User.generate_jti(resource, request.remote_ip)
      user_info = create_info(params, resource)
      if user_info[1] == 200
        render json: user_info[0], status: :created, location: user_info[0]
      else
        render json: user_info[0], status: :unprocessable_entity
      end
    else
      render json: { errors: "Couldn't generate jti." }, status: :unprocessable_entity
    end
  end

  def edit_user
    begin
      user = User.find(params[:id])
      payload = params.select {|k,v| ['name','surname','username'].include?(k) }
      payload.each do |p|
        user.update_attribute(p[0],p[1])
      end
      user.user_info.update_attribute(:user_name, user.username);
      user.user_info.update_attribute(:profile_image, user.profile_image);

    rescue => error
      render json: { errors: error}, status: :unprocessable_entity
      return
    else
      render json: {status: 'Updated'}, status: 200
      return
    end
  end

  private

  # Creates a ```UserInfo``` entry for the provided ```User```
  def create_info(createParams, resource)
    if UserRole.where(name: createParams[:user_role]).count > 0
      respective_userinfo = UserInfo.new(
        user_id: resource.id,
        user_name: resource.email.split("@")[0],
        user_role_id: UserRole.where(name: createParams[:user_role]).first.id,
      )

      calendar_annotation = CalendarAnnotation.where(isPop: true)

      if calendar_annotation.count > 0
        respective_userinfo.calendar_event = calendar_annotation.pluck(:id)
      end

      if respective_userinfo.save
        return [respective_userinfo, 200]
      else
        return [respective_userinfo.errors, 422]
      end
    else
      return [{ errors: "User role doesn't exist." }, 422]
    end
  end

  def respond_with(resource, _opts = {})
    register_success && return if resource.persisted?

    register_failed
  end

  def register_success
    render json: { message: resource }
  end

  def register_failed
    render json: { message: "Coudln't register user." }
  end
end
