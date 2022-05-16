class ApplicationController < ActionController::API
	private 

	def authenticate_user!(options = {})
		if request.headers['eduauth'].present?
			token = request.headers['eduauth'].split('Bearer ').last
			jwt_payload = User.unlock_token(token)
			if jwt_payload.instance_of? Array
				if Time.now.to_i > Integer(jwt_payload[0]["exp"])
					render json: { error: "Token has expired." }, status: 428
				end
				jtiMatch = JtiMatchList.where(user_id: jwt_payload[0]['sub'], jti: jwt_payload[0]["jti"])
				if !jtiMatch.present?
					render json: { error: "Token Mismatch." }, status: 400
				end
				@current_user = jwt_payload[0]['sub']
			else
				render json: { error: "Invalid token." }, status: :forbidden
			end
		else
			render json: { error: "No auth provided." }, status: :unauthorized
		end
	end

	def current_user
		@current_user ||= super || User.where(id: @current_user)
	end

	def signed_in?
		@current_user.present?
	end
end
