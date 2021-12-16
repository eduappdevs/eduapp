class CalendarAnnotationSerializer < ActiveModel::Serializer
  attributes :id, :annotation_date, :annotation_name, :annotation_description, :isGlobal, :user_id
end
