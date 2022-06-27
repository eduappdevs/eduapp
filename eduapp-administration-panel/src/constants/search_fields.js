function languageDetect(language) {
  if (!language) throw new Error("No language passed to fields.");
}

export function genericParser(x, field) {
  return x[field];
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

// Subjects
export function getSubjectFields(lang) {
  languageDetect(lang);
  return [
    ["id", lang.code],
    ["subject_code", lang.subjectCode],
    ["name", lang.name],
    ["course_name", lang.linkedCourse],
  ];
}

export function parseSubjectFields(s, field) {
  switch (field) {
    case "course_name":
      return s.course.name;
    default:
      return s[field];
  }
}
