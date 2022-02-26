class CreateEduappUserSessions < ActiveRecord::Migration[6.1]
  def change
    create_table :eduapp_user_sessions do |t|
      t.string :session_name
      t.string :session_start_date
      t.string :session_end_date
      t.string :streaming_platform
      t.string :resources_platform
      t.string :session_chat_id
      t.references :subject, null: false, foreign_key: true

      t.timestamps
    end
  end
end
