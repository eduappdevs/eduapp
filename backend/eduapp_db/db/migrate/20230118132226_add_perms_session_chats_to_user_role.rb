class AddPermsSessionChatsToUserRole < ActiveRecord::Migration[6.1]
  def change
    add_column :user_roles, :perms_session_chats, :bool, array: true, default: [false, false, true, false, false, false]
  end
end
