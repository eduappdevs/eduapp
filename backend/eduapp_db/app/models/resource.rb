class Resource < ApplicationRecord
    has_one_attached :firstfile
    has_one_attached :secondfile
    has_one_attached :thirdfile
end
