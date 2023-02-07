class Subject < ApplicationRecord
    belongs_to :course
    has_many :subjects_user
    has_many :users, through: :subjects_user
end
