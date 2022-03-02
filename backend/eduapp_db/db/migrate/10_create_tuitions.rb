class CreateTuitions < ActiveRecord::Migration[6.1]
  def change
    create_table :tuitions do |t|
      t.belongs_to :course, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.boolean :isTeacher

      t.timestamps
    end
  end
end
