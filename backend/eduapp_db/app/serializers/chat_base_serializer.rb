class ChatBaseSerializer < ActiveModel::Serializer
  attributes :id, :chat_name, :isGroup, :private_key, :public_key, :isReadOnly
end
