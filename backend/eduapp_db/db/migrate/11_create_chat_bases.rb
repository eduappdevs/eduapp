class CreateChatBases < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_bases do |t|
      t.string :chat_name
      t.boolean :isGroup

      t.timestamps
    end
  end
end
