class EduappUserSessionSerializer < ActiveModel::Serializer
  attributes :id, :session_name, :session_start_date, :session_end_date, :streaming_platform, :resources_platform, :session_chat_id, :batch_id
  has_one :subject
end
