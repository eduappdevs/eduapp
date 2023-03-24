class AddColumnChatLinkToSubjects < ActiveRecord::Migration[6.1]
  def change
    add_column :subjects, :chat_link, :string
  end
end
