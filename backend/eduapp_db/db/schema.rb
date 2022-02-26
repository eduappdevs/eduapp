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

ActiveRecord::Schema.define(version: 15) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
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

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "calendar_annotations", force: :cascade do |t|
    t.string "annotation_start_date"
    t.string "annotation_end_date"
    t.string "annotation_title"
    t.string "annotation_description"
    t.boolean "isGlobal"
    t.bigint "user_id", null: false
    t.bigint "subject_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["subject_id"], name: "index_calendar_annotations_on_subject_id"
    t.index ["user_id"], name: "index_calendar_annotations_on_user_id"
  end

  create_table "chat_base_infos", force: :cascade do |t|
    t.bigint "chat_base_id", null: false
    t.string "chat_img"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["chat_base_id"], name: "index_chat_base_infos_on_chat_base_id"
  end

  create_table "chat_bases", force: :cascade do |t|
    t.string "chat_name"
    t.boolean "isGroup"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "chat_messages", force: :cascade do |t|
    t.bigint "chat_base_id", null: false
    t.bigint "user_id", null: false
    t.text "message"
    t.datetime "send_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["chat_base_id"], name: "index_chat_messages_on_chat_base_id"
    t.index ["user_id"], name: "index_chat_messages_on_user_id"
  end

  create_table "chat_participants", force: :cascade do |t|
    t.bigint "chat_base_id", null: false
    t.bigint "user_id", null: false
    t.boolean "isChatAdmin"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["chat_base_id"], name: "index_chat_participants_on_chat_base_id"
    t.index ["user_id"], name: "index_chat_participants_on_user_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string "name"
    t.bigint "institution_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["institution_id"], name: "index_courses_on_institution_id"
  end

  create_table "eduapp_user_sessions", force: :cascade do |t|
    t.string "session_name"
    t.string "session_start_date"
    t.string "session_end_date"
    t.string "streaming_platform"
    t.string "resources_platform"
    t.string "session_chat_id"
    t.bigint "subject_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["subject_id"], name: "index_eduapp_user_sessions_on_subject_id"
  end

  create_table "institutions", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti"
  end

  create_table "resources", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "firstfile"
    t.string "secondfile"
    t.string "thirdfile"
    t.string "createdBy"
    t.bigint "course_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_resources_on_course_id"
  end

  create_table "subjects", force: :cascade do |t|
    t.string "name"
    t.string "teacherInCharge"
    t.string "description"
    t.string "color"
    t.bigint "course_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_subjects_on_course_id"
  end

  create_table "tuitions", force: :cascade do |t|
    t.integer "institution_id"
    t.integer "course_id"
    t.integer "user_id"
    t.string "course_name"
    t.string "institution_name"
    t.boolean "isTeacher"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "user_infos", force: :cascade do |t|
    t.string "user_name"
    t.string "profile_image"
    t.bigint "user_id"
    t.boolean "isAdmin"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_infos_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "calendar_annotations", "subjects"
  add_foreign_key "calendar_annotations", "users"
  add_foreign_key "chat_base_infos", "chat_bases", column: "chat_base_id"
  add_foreign_key "chat_messages", "chat_bases", column: "chat_base_id"
  add_foreign_key "chat_messages", "users"
  add_foreign_key "chat_participants", "chat_bases", column: "chat_base_id"
  add_foreign_key "chat_participants", "users"
  add_foreign_key "courses", "institutions"
  add_foreign_key "eduapp_user_sessions", "subjects"
  add_foreign_key "resources", "courses"
  add_foreign_key "subjects", "courses"
  add_foreign_key "user_infos", "users"
end
