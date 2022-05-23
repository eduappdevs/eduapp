puts "Creating default roles..."

UserRole.create(name: "eduapp-student", description: "Basic student permissions for EduApp.")
UserRole.create(
  name: "eduapp-admin",
  description: "Administrator privileges for EduApp.",
  perms_institution: [true, true, true, true, true, true],
  perms_course: [true, true, true, true, true, true],
  perms_subjects: [true, true, true, true, true, true],
  perms_resources: [true, true, true, true, true, true],
  perms_sessions: [true, true, true, true, true, true],
  perms_events: [true, true, true, true, true, true],
  perms_teachers: [true, true, true, true, true, true],
  perms_users: [true, true, true, true, true, true],
  perms_roles: [true, true, true, true, true, true],
  perms_jti_matchlist: [true, true, true, true, true, true],
  perms_chat: [true, true, true, true, true, true],
  perms_tuitions: [true, true, true, true, true, true],
  perms_chat_participants: [true, true, true, true, true, true],
  perms_message: [true, true, true, true, true, true],
)

UserRole.create(
  name: "eduapp-admin-query",
  description: "Administrator privileges for EduApp.",
  perms_institution: [true, true, true, false, false, false],
  perms_course: [true, true, true, false, false, false],
  perms_subjects: [true, true, true, false, false, false],
  perms_resources: [true, true, true, false, false, false],
  perms_sessions: [true, true, true, false, false, false],
  perms_events: [true, true, true, false, false, false],
  perms_teachers: [true, true, true, false, false, false],
  perms_users: [true, true, true, false, false, false],
  perms_roles: [true, true, true, false, false, false],
  perms_chat: [true, true, true, false, false, false],
  perms_tuitions: [true, true, true, false, false, false],
  perms_chat_participants: [true, true, true, false, false, false],
  perms_message: [true, true, true, false, false, false],
)

UserRole.create(
  name: "eduapp-teacher",
  description: "Teacher permissions for EduApp.",
  perms_resources: [false, true, true, true, true, true],
  perms_events: [false, false, true, true, true, true],
  perms_chat: [false, false, true, true, true, true],
  perms_chat_participants: [false, false, true, true, true, true],
  perms_message: [false, false, true, true, true, true],
)

UserRole.create(
  name: "eduapp-guest",
  description: "Guest permissions for EduApp.",
  perms_app_views: [true, true, true, false],
)
