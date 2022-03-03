class ChatParticipant < ApplicationRecord
  belongs_to :chat_base
  belongs_to :user
end
