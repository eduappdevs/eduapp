class CreateResources < ActiveRecord::Migration[6.1]
  def change
    create_table :resources do |t|
      t.string :name
      t.string :description
      t.string :firstfile
      t.string :secondfile
      t.string :thirdfile
      t.string :createdBy
      t.references :course, foreign_key: true
      t.timestamps
    end
  end
end