class CreateSubjects < ActiveRecord::Migration[6.1]
  def change
    create_table :subjects do |t|
      t.string :name
      t.string :description
      t.string :color
      t.references :course, null: false, foreign_key: true

      t.timestamps
    end
  end
end
