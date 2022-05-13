class CreateChatBases < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_bases, id: :uuid do |t|
      t.string :chat_name
      t.boolean :isGroup

      t.timestamps
    end
  end
end
