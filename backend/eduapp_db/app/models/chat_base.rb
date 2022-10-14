class ChatBase < ApplicationRecord
  has_one_attached :chat_image
  has_many :chat_participants
  has_many :chat_messages
end
