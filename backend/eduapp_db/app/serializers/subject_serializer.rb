class SubjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :teacherInCharge, :description, :color, :course_id
  has_one :course
end
