class StaticController < ApplicationController
  def home
    render json: { status: 0 }
  end

  def created
    has_admin = UserInfo.all.where(user_role_id: UserRole.where(name: "eduapp-admin").first.id).count > 0
    render json: { created: has_admin }
  end
end
