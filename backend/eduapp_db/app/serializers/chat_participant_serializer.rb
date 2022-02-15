class ChatParticipantSerializer < ActiveModel::Serializer
  attributes :id, :isChatAdmin
  has_one :chat_base
  has_one :user
end
