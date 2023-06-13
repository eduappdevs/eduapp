class TuitionSerializer < ActiveModel::Serializer
  attributes :id, :course_id, :user_id
	has_one :course
	has_one :user
end
