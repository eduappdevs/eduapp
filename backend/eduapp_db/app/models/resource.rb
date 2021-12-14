class Resource < ApplicationRecord
    it { should belong_to(:course) } 
    has_one_attached :firstfile
    has_one_attached :secondfile
    has_one_attached :thirdfile
end