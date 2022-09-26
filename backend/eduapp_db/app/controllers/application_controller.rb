class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?


  # Renders the desired table's ```extra_fields```.
  def get_extrafields
    authenticate_user!
    table = return_table(params[:table])
    render json: table.extra_fields and return
  end

  # Creates new ```extra_fields``` for the requested table.
  def push_extrafields
    authenticate_user!
    table = return_table(params[:table])
    body = request.body.read.to_s

    extrafields_body = table.extra_fields
    extrafields_body.push(body)

    if table.update(extra_fields: extrafields_body)
      table.save
      render json: table.extra_fields and return
    else
      render json: { error: "Error updating extra fields" }, status: 422 and return
    end
  end

  # Updates the desired ```extra_fields``` from the given table.
  def update_extrafield
    authenticate_user!
    table = return_table(params[:table])
    body = JSON.parse(request.body.read)
    extrafields = table.extra_fields

    extrafields_updated = []
    extrafields.each do |extrafield|
      extrafield = JSON.parse(extrafield)
      if extrafield["name"] === body["name"]
        extrafield["value"] = body["value"]
      end
      extrafields_updated.push(JSON.generate(extrafield))
    end

    if table.update(extra_fields: extrafields_updated)
      render json: table.extra_fields and return
    else
      render json: { error: "Error updating extra fields" }, status: 422 and return
    end
  end

  # Deletes any ```extra_fields``` from the given table.
  def delete_extrafield
    authenticate_user!
    table = return_table(params[:table])
    name = params[:field] || params[:name]

    extrafields_updated = []
    extrafields = table.extra_fields
    extrafields.each do |extrafield|
      extrafield = JSON.parse(extrafield)
      if extrafield["name"] != name
        extrafields_updated.push(JSON.generate(extrafield))
      end
    end

    if table.update(extra_fields: extrafields_updated)
      render json: table.extra_fields and return true
    else
      render json: { error: "Error deleting extra fields" }, status: 422 and return
    end
  end


  protected

  def configure_permitted_parameters
    added_attrs = [:username, :email, :password, :password_confirmation]
    devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
    devise_parameter_sanitizer.permit(:sign_in) do |user_params|
      user_params.permit(:username, :email)
    end
  end

  # Returns the ID's information from the requested table.
  def return_table(table)
    case table
    when "users"
      return User.find(params[:id])
    when "courses"
      return Course.find(params[:id])
    when "sessions"
      return EduappUserSession.find(params[:id])
    when "institutions"
      return Institution.find(params[:id])
    when "resources"
      return Resource.find(params[:id])
    when "subjects"
      return Subject.find(params[:id])
    end
  end


  # Filters the desired table's ```extra_fields``` for further filtration.
  def filter_extrafields(extras, table)
    check_extra_fields(table)
    extras = JSON.parse(Base64.decode64(extras))
    valuable = table.where.not(extra_fields: [])

    return nil if extras.nil?

    ids = []
    valuable.each do |entry|
      next if ids.include? entry.id
      entry.extra_fields.each do |field|
        break if ids.include? entry.id
        extras.each do |extra_field|
          break if ids.include? entry.id
          extra_field = { extra_field[0] => extra_field[1] }
          field = field.instance_of?(String) ? JSON.parse(field) : field

          ids.push(entry.id) if field["value"] =~ /^#{extra_field[field["name"]]}.*$/ && !extra_field[field["name"]].nil?
        end
      end
    end

    return ids.length > 0 ? table.where(id: ids) : nil
  end

  private

  # AUTH

  # Raises an exception if the table is not elegible for extra fields.
  def check_extra_fields(table)
    raise Exception.new "Table does is not elegible for extra fields." unless table.column_names.include?("extra_fields")
  end

  # Checks a JWT token from the request and returns an appropiate response.
  def authenticate_user!(options = {})
    if request.headers["eduauth"].present?
      token = request.headers["eduauth"].split("Bearer ").last
      jwt_payload = User.unlock_token(token)
      if jwt_payload.instance_of? Array
        if Time.now.to_i > Integer(jwt_payload[0]["exp"])
          render json: { error: "Token has expired." }, status: 428 and return
        end
        jtiMatch = JtiMatchList.where(user_id: jwt_payload[0]["sub"], jti: jwt_payload[0]["jti"])
        if jtiMatch.count === 0
          render json: { error: "Token Mismatch." }, status: 406 and return
        end
        @current_user = jwt_payload[0]["sub"]
      else
        render json: { error: "Invalid token." }, status: :forbidden and return
      end
    else
      render json: { error: "No auth provided." }, status: :unauthorized and return
    end
  end

  # Checks the incoming role of a user provided by its JWT Token.
  def check_role!
    if request.headers["eduauth"].present?
      token = request.headers["eduauth"].split("Bearer ").last
      jwt_payload = User.unlock_token(token)
      if jwt_payload.instance_of? Array
        valid_role = false
        UserRole.all.each do |role|
          if role.name === jwt_payload[0]["aud"]
            valid_role = true
            break
          end
        end

        if !valid_role
          render json: { error: "Invalid role." }, status: :forbidden and return
        end
      end
    end
  end

  def current_user
    @current_user ||= super || User.where(id: @current_user)
  end

  def signed_in?
    @current_user.present?
  end

  # UTILS

  # Returns a ```UserRole``` entry for the currently existing admin role.
  def get_admin_role
    return UserRole.where(name: "eduapp-admin").first
  end

  # Returns the user's respective ```UserRole``` information.
  def get_user_roles(user_id = @current_user)
    return UserRole.find(UserInfo.where(user_id: user_id).first.user_role_id)
  end

  # Serializes each element in an array.
  def serialize_each(array, iExcept = [], iInclude = [])
    s = []
    array.each do |item|
      s.push(item.serializable_hash(except: iExcept, include: iInclude))
    end
    return s
  end

  # Paginates an ```ActiveRecord``` query.
  def query_paginate(query, page, limit = 10)
    page = Integer(page)
    if page - 1 < 0
      return { :error => "Page cannot be less than 1" }
    end
    return { :current_page => query.limit(limit).offset((page - 1) * limit), :total_pages => (query.count.to_f / limit).ceil, :page => page }
  end

  # Paginates an array.
  def array_paginate(array, page, limit = 10)
    return array.slice(Integer(page) > 0 ? Integer(page) - 1 : 0, limit)
  end

  # A parser made to correctly return a decoded order filter.
  def parse_filter_order(order)
    order = JSON.parse(Base64.decode64(order))
    return { order["field"] => order["order"] == "asc" ? :asc : :desc }
  end

  # PERMISSIONS

  # Deny access due to permissions.
  def deny_perms_access!
    render json: { error: "You do not have permission to access this endpoint." }, status: :forbidden and return false
  end

  # Deny action due to permissions.
  def deny_perms_action!
    render json: { error: "You do not have permission to perform this action." }, status: 405 and return false
  end

  # Checks the owner that executed the desired action.
  def check_action_owner!(requested_id)
    if requested_id === @current_user
      return true
    else
      return deny_perms_action! unless get_user_roles.name === get_admin_role.name and return true
    end
  end

  # Checks ```UserRole``` permissions for querying everything.
  def check_perms_all!(user_roles)
    if user_roles[0]
      return true
    else
      return deny_perms_access!
    end
  end

  # Checks ```UserRole``` permissions for performing specific queries.
  def check_perms_query!(user_roles)
    if user_roles[1]
      return true
    else
      return deny_perms_access!
    end
  end

  # Checks ```UserRole``` permissions for querying information about itself..
  def check_perms_query_self!(user_roles, query_user_id)
    if user_roles[2]
      if query_user_id == @current_user
        return true
      else
        return check_perms_query!(user_roles)
      end
    else
      return deny_perms_access!
    end
  end

  # Checks ```UserRole``` permissions for creating.
  def check_perms_write!(user_roles)
    if user_roles[3]
      return true
    else
      return deny_perms_action!
    end
  end

  # Checks ```UserRole``` permissions for updating.
  def check_perms_update!(user_roles, needs_owner_check = false, requested_id = nil)
    if user_roles[4]
      return true
    else
      if needs_owner_check
        return check_action_owner!(requested_id)
      else
        return deny_perms_action!
      end
    end
  end

  # Checks ```UserRole``` permissions for deleting.
  def check_perms_delete!(user_roles, needs_owner_check, requested_id)
    if user_roles[5]
      return true
    else
      if needs_owner_check
        return check_action_owner!(requested_id)
      else
        return deny_perms_action!
      end
    end
  end
end
