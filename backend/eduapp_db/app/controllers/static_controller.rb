class StaticController < ApplicationController
  # Checks if the server is alive.
  def ping
    render json: { status: "Pong!" }
  end

  # Tests if there is an existing administrator.
  def admin
    render json: { created: UserInfo.where(user_role_id: UserRole.find_by(name: "eduapp-admin").id).count > 0 } and return
  end

  # Checks for at least 1 ```Institution``` entry.
  def created
    render json: { created: Institution.all.count > 0 } and return
  end
end
