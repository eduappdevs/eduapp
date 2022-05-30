class CreateResources < ActiveRecord::Migration[6.1]
  def change
    create_table :resources do |t|
      t.string :name
      t.string :description
      t.string :blob_id_delete
      t.string :resource_files, array: true
      t.string :resource_files_json, array: true
      t.string :createdBy
      t.references :subject, foreign_key: true
      t.timestamps
    end
  end
end