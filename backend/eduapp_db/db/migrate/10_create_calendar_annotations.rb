class CreateCalendarAnnotations < ActiveRecord::Migration[6.1]
  def change
    create_table :calendar_annotations do |t|
      t.string :annotation_start_date
      t.string :annotation_end_date
      t.string :annotation_title
      t.string :annotation_description
      t.boolean :isGlobal
      t.integer :user_id

      t.timestamps
    end
  end
end
