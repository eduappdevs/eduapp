class CreateUserRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :user_roles, id: :uuid do |t|
      t.string :name, null: false
      t.string :description, null: true

      # [read_all, query, view_self, write, update, delete]
      # read_all -> allows to read every entry.
      # query -> allows to do selected queries, but not Model.all.
      # view_self -> allows to do view information related to the user, but not Model.all.
      # write -> allows to create new entries.
      # update -> allows to update existing entries.
      # delete -> allows to delete entries.

      # Defaults are setup for a basic user client
      t.boolean :perms_institution, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_course, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_subjects, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_resources, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_sessions, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_events, array: true, default: [false, false, true, false, false, false]

      t.boolean :perms_teachers, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_users, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_roles, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_tuitions, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_jti_matchlist, array: true, default: [false, false, true, false, false, false]

      t.boolean :perms_chat, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_chat_participants, array: true, default: [false, false, true, false, false, false]
      t.boolean :perms_message, array: true, default: [false, false, true, false, false, false]

      # [calendar, resources, chat]
      # Home is the default route every user will see and cannot be hidden.
      t.boolean :perms_app_views, array: true, default: [true, true, true]

      t.timestamps
    end
  end
end
