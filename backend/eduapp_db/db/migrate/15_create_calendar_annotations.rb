class CreateCalendarAnnotations < ActiveRecord::Migration[6.1]
  def change
    create_table :calendar_annotations, id: :uuid do |t|
      t.string :annotation_start_date
      t.string :annotation_end_date
      t.string :annotation_title
      t.string :annotation_description
      t.boolean :isGlobal
      t.boolean :isPop
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.belongs_to :subject, foreign_key: true, type: :uuid
      t.timestamps
    end

    change_column_null(:calendar_annotations, :subject_id, true)
  end
end
