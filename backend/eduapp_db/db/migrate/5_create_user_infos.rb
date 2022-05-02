class CreateUserInfos < ActiveRecord::Migration[6.1]
  def change
    create_table :user_infos do |t|
      t.string :user_name
      t.string :profile_image
			t.integer :teaching_list, array: true, default: []
      t.references :user, foreign_key: true
      t.boolean :isAdmin
      t.string :googleid
      t.boolean :isLoggedWithGoogle

      t.timestamps
    end
  end
end
