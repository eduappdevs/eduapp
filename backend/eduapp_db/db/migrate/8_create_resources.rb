class CreateResources < ActiveRecord::Migration[6.1]
  def change
    create_table :resources, id: :uuid do |t|
      t.string :name
      t.string :description

      t.uuid :blob_id_delete
      t.string :resource_files, array: true
      t.string :resource_files_json, array: true
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.belongs_to :subject, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
