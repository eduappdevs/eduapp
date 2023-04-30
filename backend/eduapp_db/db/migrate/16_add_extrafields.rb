class AddExtrafields < ActiveRecord::Migration[6.1]
  def change
    tables = ActiveRecord::Base.connection.tables

    # Adds an :extra_fields column to every table except the ones below.
    blacklisted_tables = [
      "schema_migrations",
      "ar_internal_metadata",
      "jwt_blacklist",
      "jwt_denylist",
      "jti_match_lists",
      "active_storage_attachments",
      "active_storage_blobs",
      "chat_messages",
      "chat_bases",
      "chat_base_infos",
      "active_storage_variant_records",
      "tuitions",
      "calendar_annotations",
      "chat_participants",
      "user_infos",
      "user_roles",
    ]

    tables.each do |table|
      if !blacklisted_tables.include?(table)
        add_column table, :extra_fields, :string, array: true, default: []
      end
    end
  end
end
