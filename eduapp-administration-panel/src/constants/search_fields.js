/*
 * This module is used as a hub for all field parsers for every table.
 * These are generally used for the 'useFilter' hook.
 */

// SCHEDULE

// Sessions
export function getSessionFields(lang) {
  languageDetect(lang);
  return [
    ["session_name", lang.name],
    ["id", lang.code],
    ["streaming_platform", lang.streaming],
    ["resources_platform", lang.resources],
    ["session_chat_id", lang.chatLink],
    ["subject_name", lang.subjects],
  ];
}

export function parseSessionFields(s, field) {
  switch (field) {
    case "subject_name":
      return s.subject.name;
    default:
      return s[field];
  }
}

// Events
export function getEventFields(lang) {
  languageDetect(lang);
  return [
    ["annotation_title", lang.title],
    ["id", lang.code],
    ["annotation_description", lang.description],
    ["event_author", lang.author],
    ["subject_name", lang.subjects],
  ];
}

export function parseEventFields(e, field) {
  switch (field) {
    case "event_author":
      return e.user.email;
    case "subject_name":
      return e.subject.name;
    default:
      return e[field];
  }
}

// USERS

// Users
export function getUserFields(lang) {
  languageDetect(lang);
  return [
    ["user_name", lang.name],
    //["user_id", lang.userId],
    ["email", lang.email],
    //["role", lang.userRole],
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

// Enrollment
export function getEnrollmentFields(lang) {
  languageDetect(lang);
  return [
    ["user_email", lang.email],
    ["course_name", lang.course],
  ];
}

export function parseEnrollmentFields(er, field) {
  switch (field) {
    case "user_email":
      return er.user.email;
    case "course_name":
      return er.course.name;
    default:
      return er[field];
  }
}

// Enrollment Subject
export function getSubjectEnrollmentFields(lang) {
  languageDetect(lang);
  return [
    ["user_email", lang.email],
    ["subject_name", lang.subject],
  ];
}

export function parseSubjectEnrollmentFields(er, field) {
  switch (field) {
    case "user_email":
      return er.user.email;
    case "subject_name":
      return er.subject.name;
    default:
      return er[field];
  }
}

// Teachers
export function getTeacherFields(lang) {
  languageDetect(lang);
  return [
    ["teacher_name", lang.teacherName],
    ["subject_name", lang.subjectName],
  ];
}

export function parseTeacherFields(t, field) {
  switch (field) {
    case "teacher_name":
      return t.user.user_name;
    case "subject_name":
      return t.subject.name;
    default:
      return t[field];
  }
}

// MANAGEMENT

// Courses
export function getCourseFields(lang) {
  languageDetect(lang);
  return [
    ["name", lang.name],
    ["id", lang.code],
  ];
}

// Subjects
export function getSubjectFields(lang) {
  languageDetect(lang);
  return [
    ["name", lang.name],
    ["id", lang.code],
    ["subject_code", lang.subjectCode],
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

// Resources
export function getResourceFields(lang) {
  languageDetect(lang);
  return [
    ["name", lang.name],
    ["id", lang.code],
    ["author", lang.author],
    ["subject_name", lang.subjects],
  ];
}

export function parseResourceFields(r, field) {
  switch (field) {
    case "author":
      return r.user.email;
    case "subject_name":
      return r.subject.name;
    default:
      return r[field];
  }
}

// SETTINGS

// User Roles
export function getRoleFields(lang) {
  languageDetect(lang);
  return [["name", lang.name]];
}

// CHAT SETTINGS

// Chat Base
export function getChatFields(lang) {
  languageDetect(lang);
  return [["name", lang.name]];
}

// Chat Participants
export function getParticipantFields(lang) {
  languageDetect(lang);
  return [
    ["email", lang.email],
    ["chat_name", lang.chatName],
  ];
}

export function parseParticipantFields(pt, field) {
  switch (field) {
    case "email":
      return pt.user.email;
    case "chat_name":
      return pt.chat_base.chat_name;
    default:
      return pt[field];
  }
}

// HELPER METHODS
function languageDetect(language) {
  if (!language) throw new Error("No language passed to fields.");
}

export function genericParser(x, field) {
  return x[field];
}

export function genericRequestParser(fields, query, field, extras = null) {
  let info = {
    extras: btoa(JSON.stringify(extras)),
  };
  for (let f of fields) if (f[0] === field) info[field] = query;

  return info;
}

export function extraFieldsParser(efArray) {
  let ef = {};
  for (let field of efArray) {
    if (field[0] !== "" && field.length > 0) ef[field[0]] = field[1];
  }
  return Object.keys(ef).length === 0 ? null : ef;
}

export function orderParser(order, orderBy) {
  return { order: order, field: orderBy };
}
