class UserInfoSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :user_name , :user_id , :profile_image , :isAdmin , :googleid ,:isLoggedWithGoogle
	has_one :user
end
