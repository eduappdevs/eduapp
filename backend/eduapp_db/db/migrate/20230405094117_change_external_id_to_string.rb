class ChangeExternalIdToString < ActiveRecord::Migration[6.1]
  def change
    change_column :subjects, :external_id, :string
  end
end
