class CreateChatParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_participants, id: :uuid do |t|
      t.belongs_to :chat_base, null: false, foreign_key: true, type: :uuid
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.string :status, null: false, default: "Offline"
      t.datetime :last_seen
      t.boolean :isChatAdmin

      t.timestamps
    end
  end
end
