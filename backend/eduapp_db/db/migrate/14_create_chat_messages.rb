class CreateChatMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_messages, id: :uuid do |t|
      t.belongs_to :chat_base, null: false, foreign_key: true, type: :uuid
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.text :message
      t.boolean :read
      t.datetime :send_date

      t.timestamps
    end
  end
end
