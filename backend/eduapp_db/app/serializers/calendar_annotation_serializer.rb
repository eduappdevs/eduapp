class CalendarAnnotationSerializer < ActiveModel::Serializer
  attributes :id, :annotation_start_date,:annotation_end_date, :annotation_title, :annotation_description, :isGlobal,:user_infos
  # has_one :user
end
