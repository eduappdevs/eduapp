class UserRoleSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :perms_institution, :perms_course, :perms_subjects, :perms_resources, :perms_sessions, :perms_events, :perms_teachers, :perms_users, :perms_roles, :perms_tuitions, :perms_jti_matchlist, :perms_chat, :perms_chat_participants, :perms_message, :perms_app_views
end
