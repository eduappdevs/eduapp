class ChatMessageSerializer < ActiveModel::Serializer
  attributes :id, :message, :send_date
  has_one :chat_base
  has_one :user
end
