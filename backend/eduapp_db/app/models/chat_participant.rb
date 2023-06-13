class ChatParticipant < ApplicationRecord
  belongs_to :chat_base
  belongs_to :user

	enum status: {
		"Offline" => 0,
		"Online" => 1,
	}
end
