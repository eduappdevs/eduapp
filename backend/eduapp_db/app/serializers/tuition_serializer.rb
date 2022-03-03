class TuitionSerializer < ActiveModel::Serializer
  attributes :id, :course_id, :user_id , :isTeacher
	has_one :course
	has_one :user
end
