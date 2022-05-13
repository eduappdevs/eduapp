class CreateChatBaseInfos < ActiveRecord::Migration[6.1]
  def change
    create_table :chat_base_infos, id: :uuid do |t|
      t.belongs_to :chat_base, null: false, foreign_key: true, type: :uuid
      t.string :chat_img

      t.timestamps
    end
  end
end
