class CreateChatParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_participants do |t|
      t.belongs_to :chat_base, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.boolean :isChatAdmin

      t.timestamps
    end
  end
end
