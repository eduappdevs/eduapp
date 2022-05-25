class ChatBaseSerializer < ActiveModel::Serializer
  attributes :id, :chat_name, :isGroup, :isReadOnly
end
