class CreateResources < ActiveRecord::Migration[6.1]
  def change
    create_table :resources do |t|
      t.string :name
      t.string :description
      t.string :firstfile
      t.string :secondfile
      t.string :thirdfile
      t.timestamps
    end
  end
end