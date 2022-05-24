class UserInfoSerializer < ActiveModel::Serializer
  attributes :id, :user_name, :profile_image, :teaching_list, :isTeacher, :isAdmin, :googleid, :isLoggedWithGoogle
  has_one :user_role
  has_one :user
end
