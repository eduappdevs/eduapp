class CreateUserInfos < ActiveRecord::Migration[6.1]
  def change
    create_table :user_infos do |t|
      t.string :user_name
      t.string :profile_image
			t.integer :teaching_list, array: true, default: []
			t.boolean :isTeacher, default: false
      t.references :user, foreign_key: true
      t.boolean :isAdmin, default: false
      t.string :googleid
      t.boolean :isLoggedWithGoogle, default: false

      t.timestamps
    end
  end
end
