class PushNoticationSerializer < ActiveModel::Serializer
  attributes :id, :endpoint, :user_id, :p256dh, :auth
end
