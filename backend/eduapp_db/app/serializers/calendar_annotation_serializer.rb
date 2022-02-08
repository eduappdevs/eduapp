class CalendarAnnotationSerializer < ActiveModel::Serializer
  attributes :id, :annotation_start_date,:annotation_end_date, :annotation_title, :annotation_description,:location, :isGlobal, :user_id
end
