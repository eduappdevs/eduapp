class CalendarAnnotation < ApplicationRecord
    # belongs_to :course
    belongs_to :user
    belongs_to :subject
end
