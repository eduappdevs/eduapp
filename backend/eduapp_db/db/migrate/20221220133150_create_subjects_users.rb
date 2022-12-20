class CreateSubjectsUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :subjects_users, id: :uuid do |t|
      t.references :subject, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
