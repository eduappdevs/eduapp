class CreateResources < ActiveRecord::Migration[6.1]
  def change
    create_table :resources, id: :uuid do |t|
      t.string :name
      t.string :description
      t.string :firstfile
      t.string :secondfile
      t.string :thirdfile
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.references :subject, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end
