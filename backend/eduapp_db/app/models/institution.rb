class Institution < ApplicationRecord
    has_many :course, foreign_key: "course_id"
end
