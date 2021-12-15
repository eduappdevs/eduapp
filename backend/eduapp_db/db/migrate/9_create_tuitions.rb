class CreateTuitions < ActiveRecord::Migration[6.1]
  def change
    create_table :tuitions do |t|
      t.integer :course_id
      t.integer :user_id

      t.timestamps
    end
  end
end
