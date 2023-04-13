class Resource < ApplicationRecord
  belongs_to :subject
  belongs_to :user

  has_many_attached :files
end
