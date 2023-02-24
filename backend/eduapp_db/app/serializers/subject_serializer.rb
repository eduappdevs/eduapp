class SubjectSerializer < ActiveModel::Serializer
  attributes :id,:subject_code, :name, :description, :color, :course_id, :chat_link
  has_one :course
end
