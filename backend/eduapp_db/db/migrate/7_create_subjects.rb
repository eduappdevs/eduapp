class CreateSubjects < ActiveRecord::Migration[6.1]
  def change
    create_table :subjects, id: :uuid do |t|
      t.string :name
      t.string :description
      t.string :color
      t.references :course, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
