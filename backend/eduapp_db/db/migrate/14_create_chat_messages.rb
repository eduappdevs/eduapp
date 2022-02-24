class CreateChatMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_messages do |t|
      t.belongs_to :chat_base, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.text :message
      t.datetime :send_date

      t.timestamps
    end
  end
end
