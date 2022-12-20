# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_12_20_133150) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "calendar_annotations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "annotation_start_date"
    t.string "annotation_end_date"
    t.string "annotation_title"
    t.string "annotation_description"
    t.boolean "isGlobal"
    t.boolean "isPop"
    t.uuid "user_id", null: false
    t.uuid "subject_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["subject_id"], name: "index_calendar_annotations_on_subject_id"
    t.index ["user_id"], name: "index_calendar_annotations_on_user_id"
  end

  create_table "chat_bases", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "chat_name", null: false
    t.boolean "isReadOnly", default: false, null: false
    t.boolean "isGroup", null: false
    t.string "private_key"
    t.string "public_key"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "chat_messages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "chat_base_id", null: false
    t.uuid "user_id", null: false
    t.text "message"
    t.boolean "read"
    t.datetime "send_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["chat_base_id"], name: "index_chat_messages_on_chat_base_id"
    t.index ["user_id"], name: "index_chat_messages_on_user_id"
  end

  create_table "chat_participants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "chat_base_id", null: false
    t.uuid "user_id", null: false
    t.string "status", default: "Offline", null: false
    t.datetime "last_seen"
    t.boolean "isChatAdmin"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["chat_base_id"], name: "index_chat_participants_on_chat_base_id"
    t.index ["user_id"], name: "index_chat_participants_on_user_id"
  end

  create_table "courses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.uuid "institution_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "extra_fields", default: [], array: true
    t.index ["institution_id"], name: "index_courses_on_institution_id"
  end

  create_table "eduapp_user_sessions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "session_name"
    t.string "session_start_date"
    t.string "session_end_date"
    t.string "streaming_platform"
    t.string "resources_platform"
    t.string "session_chat_id"
    t.uuid "batch_id"
    t.uuid "subject_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "extra_fields", default: [], array: true
    t.index ["subject_id"], name: "index_eduapp_user_sessions_on_subject_id"
  end

  create_table "institutions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "extra_fields", default: [], array: true
  end

  create_table "jti_match_lists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "jti", null: false
    t.string "exp"
    t.string "access_ip", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_jti_match_lists_on_user_id"
  end

  create_table "resources", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.uuid "blob_id_delete"
    t.string "resource_files", array: true
    t.string "resource_files_json", array: true
    t.uuid "user_id", null: false
    t.uuid "subject_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "extra_fields", default: [], array: true
    t.index ["subject_id"], name: "index_resources_on_subject_id"
    t.index ["user_id"], name: "index_resources_on_user_id"
  end

  create_table "subjects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "subject_code"
    t.string "name"
    t.string "description"
    t.string "color"
    t.uuid "course_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "extra_fields", default: [], array: true
    t.index ["course_id"], name: "index_subjects_on_course_id"
  end

  create_table "subjects_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "subject_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["subject_id"], name: "index_subjects_users_on_subject_id"
    t.index ["user_id"], name: "index_subjects_users_on_user_id"
  end

  create_table "tuitions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "course_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_tuitions_on_course_id"
    t.index ["user_id"], name: "index_tuitions_on_user_id"
  end

  create_table "user_infos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_name"
    t.string "profile_image"
    t.uuid "teaching_list", default: [], array: true
    t.uuid "calendar_event", default: [], array: true
    t.uuid "user_id"
    t.string "googleid"
    t.boolean "isLoggedWithGoogle", default: false
    t.uuid "user_role_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_infos_on_user_id"
    t.index ["user_role_id"], name: "index_user_infos_on_user_role_id"
  end

  create_table "user_roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.boolean "perms_institution", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_course", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_subjects", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_resources", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_sessions", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_events", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_teachers", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_users", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_roles", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_tuitions", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_jti_matchlist", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_chat", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_chat_participants", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_message", default: [false, false, true, false, false, false], array: true
    t.boolean "perms_app_views", default: [true, true, true], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "surname"
    t.string "email", default: "", null: false
    t.string "username"
    t.string "encrypted_password", default: "", null: false
    t.string "encrypted_googleid"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_code"
    t.datetime "confirmation_code_exp_time"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "extra_fields", default: [], array: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["encrypted_googleid"], name: "index_users_on_encrypted_googleid", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "calendar_annotations", "subjects"
  add_foreign_key "calendar_annotations", "users"
  add_foreign_key "chat_messages", "chat_bases", column: "chat_base_id"
  add_foreign_key "chat_messages", "users"
  add_foreign_key "chat_participants", "chat_bases", column: "chat_base_id"
  add_foreign_key "chat_participants", "users"
  add_foreign_key "courses", "institutions"
  add_foreign_key "eduapp_user_sessions", "subjects"
  add_foreign_key "jti_match_lists", "users"
  add_foreign_key "resources", "subjects"
  add_foreign_key "resources", "users"
  add_foreign_key "subjects", "courses"
  add_foreign_key "subjects_users", "subjects"
  add_foreign_key "subjects_users", "users"
  add_foreign_key "tuitions", "courses"
  add_foreign_key "tuitions", "users"
  add_foreign_key "user_infos", "user_roles"
  add_foreign_key "user_infos", "users"
end
