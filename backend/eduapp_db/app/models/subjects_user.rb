class SubjectsUser < ApplicationRecord
  belongs_to :subject
  belongs_to :user
end
