class Resource < ApplicationRecord
    belongs_to :subject
    has_one_attached :firstfile
    has_one_attached :secondfile
    has_one_attached :thirdfile
end