class Resource < ApplicationRecord
    belongs_to :subject
    has_many_attached :files
end