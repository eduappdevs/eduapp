class CourseSerializer < ActiveModel::Serializer
  attributes :id, :name, :institution_id
  has_one :institution
end
