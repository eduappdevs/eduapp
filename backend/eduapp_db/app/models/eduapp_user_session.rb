class EduappUserSession < ApplicationRecord
    it { should belong_to(:course) } 
end
