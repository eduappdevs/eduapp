function languageDetect(language) {
  if (!language) throw new Error("No language passed to fields.");
}

// USERS

// Users
export function getUserFields(lang) {
  languageDetect(lang);
  return [
    ["user_id", lang.userId],
    ["user_name", lang.name],
    ["email", lang.email],
    ["role", lang.userRole],
  ];
}

export function parseUserFields(u, field) {
  switch (field) {
    case "user_id":
      return u.user.id;
    case "email":
      return u.user.email;
    case "role":
      return u.user_role.name;
    default:
      return u[field];
  }
}

// MANAGEMENT

// Courses
export function getCourseFields(lang) {
  languageDetect(lang);
  return [
    ["id", lang.code],
    ["name", lang.name],
  ];
}

export function parseCourseFields(c, field) {
  return c[field];
}
