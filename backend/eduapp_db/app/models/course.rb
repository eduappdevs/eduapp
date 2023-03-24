class Course < ApplicationRecord
    belongs_to :institution
    has_many :eduapp_user_session
    has_many :resource
    has_one :calendar_annotation
end
