class CreateEduappUserSessions < ActiveRecord::Migration[6.1]
  def change
    create_table :eduapp_user_sessions do |t|
      t.string :session_name
      t.string :session_date
      t.string :streaming_platform
      t.string :resources_platform
      t.string :session_chat_id

      t.timestamps
    end
  end
end
