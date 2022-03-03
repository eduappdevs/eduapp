class ChatBaseInfoSerializer < ActiveModel::Serializer
  attributes :id, :chat_img
  has_one :chat_base
end
