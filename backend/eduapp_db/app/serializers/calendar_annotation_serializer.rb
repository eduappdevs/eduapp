class CalendarAnnotationSerializer < ActiveModel::Serializer
  attributes :id, :annotation_start_date,:annotation_end_date, :annotation_title, :annotation_description, :isGlobal, :isPop, :user_id, :subject_id
  has_one :user
  has_one :subject
end
