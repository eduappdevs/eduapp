class ChatBase < ApplicationRecord
  has_one_attached :chat_image
  has_many :chat_participants, dependent: :destroy
  has_many :chat_messages, dependent: :destroy
end
