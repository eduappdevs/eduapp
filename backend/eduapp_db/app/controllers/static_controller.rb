class StaticController < ApplicationController
    def home
        render json: {status: 0}
    end

		def created
			has_admin = UserInfo.all.where(isAdmin: true).count > 0
			render json: {created: has_admin}
		end
end