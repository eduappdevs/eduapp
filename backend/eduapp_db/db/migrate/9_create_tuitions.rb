class CreateTuitions < ActiveRecord::Migration[6.1]
  def change
    create_table :tuitions do |t|
      t.integer :institution_id
      t.integer :course_id
      t.integer :user_id
      t.string :course_name
      t.string :institution_name
      

      t.timestamps
    end
  end
end
