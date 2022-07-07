class StaticController < ApplicationController
  def ping
    render json: { status: "Pong!" }
  end

  def admin
    render json: { created: UserInfo.where(user_role_id: UserRole.find_by(name: "eduapp-admin").id).count > 0 } and return
  end

  def created
    render json: { created: Institution.all.count > 0 } and return
  end
end
