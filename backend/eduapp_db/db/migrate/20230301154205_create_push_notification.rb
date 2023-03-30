class CreatePushNotification < ActiveRecord::Migration[6.1]
  def change
    create_table :push_notifications do |t|
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.text :endpoint
      t.text :p256dh
      t.text :auth

      t.timestamps
    end
  end
end
