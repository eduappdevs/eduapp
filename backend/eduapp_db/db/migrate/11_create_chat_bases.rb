class CreateChatBases < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_bases, id: :uuid do |t|
      t.string :chat_name, null: false
      t.boolean :isReadOnly, null: false, default: false
      t.boolean :isGroup, null: false
      t.string :private_key, null: true
      t.string :public_key, null: true

      t.timestamps
    end
  end
end
