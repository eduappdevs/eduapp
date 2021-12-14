class CalendarAnnotation < ApplicationRecord
    it { should belong_to(:course) } 
end
