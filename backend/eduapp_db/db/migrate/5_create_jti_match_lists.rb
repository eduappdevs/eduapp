class CreateJtiMatchLists < ActiveRecord::Migration[6.1]
  def change
		create_table :jti_match_lists, id: :uuid do |t|
			t.references :user, null: false, foreign_key: true, type: :uuid
			t.string :jti, null: false
			t.string :exp
			t.string :access_ip, null: false

			t.timestamps null: false
		end
  end
end
