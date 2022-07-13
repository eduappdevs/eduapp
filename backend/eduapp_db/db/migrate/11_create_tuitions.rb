class CreateTuitions < ActiveRecord::Migration[6.1]
  def change
    create_table :tuitions, id: :uuid do |t|
      t.belongs_to :course, null: false, foreign_key: true, type: :uuid
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
