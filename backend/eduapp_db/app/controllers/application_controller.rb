class ApplicationController < ActionController::API
  def return_table(table)
    case table
    when "users"
      t_name = User.find(params[:id])
    when "courses"
      t_name = Course.find(params[:id])
    when "sessions"
      t_name = EduappUserSession.find(params[:id])
    when "institutions"
      t_name = Institution.find(params[:id])
    when "resources"
      t_name = Resource.find(params[:id])
    when "subjects"
      t_name = Subject.find(params[:id])
    end
    return t_name
  end

  def get_extrafields
    authenticate_user!
    table = return_table(params[:table])
    render json: table.extra_fields and return
  end

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
      render json: { error: "Error updating extra fields" }, status: 422 and return
    end
  end

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
          field = JSON.parse field

          ids.push(entry.id) if field["value"] =~ /^#{extra_field[field["name"]]}.*$/ && !extra_field[field["name"]].nil?
        end
      end
    end

    return ids.length > 0 ? table.where(id: ids) : nil
  end

  private

  # AUTH

  def check_extra_fields(table)
    raise Exception.new "Table does is not elegible for extra fields." unless table.column_names.include?("extra_fields")
  end

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

  def get_admin_role
    return UserRole.where(name: "eduapp-admin").first
  end

  def get_user_roles(user_id = @current_user)
    return UserRole.find(UserInfo.where(user_id: user_id).first.user_role_id)
  end

  def serialize_each(array, iExcept = [], iInclude = [])
    s = []
    array.each do |item|
      s.push(item.serializable_hash(except: iExcept, include: iInclude))
    end
    return s
  end

  def query_paginate(query, page, limit = 10)
    page = Integer(page)
    if page - 1 < 0
      return { :error => "Page cannot be less than 1" }
    end
    return { :current_page => query.limit(limit).offset((page - 1) * limit), :total_pages => (query.count.to_f / limit).ceil }
  end

  def array_paginate(array, page, limit = 10)
    return array.slice(Integer(page) > 0 ? Integer(page) - 1 : 0, limit)
  end

  # PERMISSIONS

  def deny_perms_access!
    render json: { error: "You do not have permission to access this endpoint." }, status: :forbidden and return false
  end

  def deny_perms_action!
    render json: { error: "You do not have permission to perform this action." }, status: 405 and return false
  end

  def check_action_owner!(requested_id)
    if requested_id === @current_user
      return true
    else
      return deny_perms_action! unless get_user_roles.name === "eduapp-admin" and return true
    end
  end

  def check_perms_all!(user_roles)
    if user_roles[0]
      return true
    else
      return deny_perms_access!
    end
  end

  def check_perms_query!(user_roles)
    if user_roles[1]
      return true
    else
      return deny_perms_access!
    end
  end

  def check_perms_query_self!(user_roles, query_user_id)
    if user_roles[2]
      if query_user_id === @current_user
        return true
      else
        return check_perms_query!(user_roles)
      end
    else
      return deny_perms_access!
    end
  end

  def check_perms_write!(user_roles)
    if user_roles[3]
      return true
    else
      return deny_perms_action!
    end
  end

  def check_perms_update!(user_roles, needs_owner_check, requested_id)
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
