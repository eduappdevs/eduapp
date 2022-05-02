class SubjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :color, :course_id
  has_one :course
end
