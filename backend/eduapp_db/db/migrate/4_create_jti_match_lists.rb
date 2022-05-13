class CreateJtiMatchLists < ActiveRecord::Migration[6.1]
  def change
		create_table :jti_match_lists do |t|
			t.references :user, null: false, foreign_key: true
			t.string :jti, null: false
			t.string :exp
			t.string :access_ip, null: false

			t.timestamps null: false
		end
  end
end
