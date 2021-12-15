class TuitionSerializer < ActiveModel::Serializer
  attributes :id, :course_id, :user_id , :course_name , :institution_name
end
