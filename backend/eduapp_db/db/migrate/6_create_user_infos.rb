class CreateUserInfos < ActiveRecord::Migration[6.1]
  def change
    create_table :user_infos, id: :uuid do |t|
      t.string :user_name
      t.string :profile_image
      t.uuid :teaching_list, array: true, default: []
      t.boolean :isTeacher, default: false
      t.references :user, foreign_key: true, type: :uuid
      t.boolean :isAdmin, default: false
      t.string :googleid
      t.boolean :isLoggedWithGoogle, default: false
      t.references :user_role, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
