class Course < ApplicationRecord
    it { should belong_to(:institution) } 
    has_many :eduapp_user_session, foreign_key: "session_id"
    has_many :resource, foreign_key: "resource_id"
    has_one :calendar_annotation, foreign_key: "calendarAnnotation_id"
    
end
