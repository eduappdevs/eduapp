class SubjectsUserSerializer < ActiveModel::Serializer
  attributes :id, :subject_id, :user_id
	has_one :subject
	has_one :user
end
