class EduappUserSessionSerializer < ActiveModel::Serializer
    attributes :session_name, :session_start_date,:session_end_date, :streaming_platform, :resources_platform, :session_chat_id , :subject_id
    has_one :subject
end