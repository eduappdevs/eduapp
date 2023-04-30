class ChatBaseSerializer < ActiveModel::Serializer
  attributes :id, :chat_name, :isGroup, :isReadOnly, :private_key, :public_key, :chat_participants
end
