class Users::RegistrationsController < Devise::RegistrationsController
    respond_to :json

		def create
			build_resource({email: params[:email], password: params[:password]})
	
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
			
			user_info = create_info(params, resource)
			if user_info[1] == 200
				render json: user_info[0], status: :created, location: user_info[0]
			else
				render json: user_info[0], status: :unprocessable_entity
			end
		end
  
    private

		def create_info(createParams, resource)
			respective_userinfo = UserInfo.new(
				user_id: resource.id, 
				user_name: resource.email.split('@')[0], 
				isAdmin: createParams[:isAdmin], 
				isTeacher: createParams[:isTeacher].present? ? createParams[:isTeacher] : false
			)
			
			if respective_userinfo.save
				return [respective_userinfo, 200]
			else
				return [respective_userinfo.errors, 422]
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