class CreateCourses < ActiveRecord::Migration[6.1]
  def change
    create_table :courses, id: :uuid do |t|
      t.string :name
      t.references :institution, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
