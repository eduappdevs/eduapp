class Resource < ApplicationRecord
  belongs_to :subject
  belongs_to :user
  has_one_attached :firstfile
  has_one_attached :secondfile
  has_one_attached :thirdfile
end
