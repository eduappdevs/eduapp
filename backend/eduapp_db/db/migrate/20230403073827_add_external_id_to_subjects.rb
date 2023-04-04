class AddExternalIdToSubjects < ActiveRecord::Migration[6.1]
  def change
    add_column :subjects, :external_id, :uuid
  end
end
