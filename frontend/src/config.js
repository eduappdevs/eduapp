const API_URL = "http://localhost:3000";
const USERS = `${API_URL}/users`;
const RESOURCES = `${API_URL}/resources`;
const EDUAPP_SESSIONS = `${API_URL}/eduapp_user_sessions`;
const USERS_INFO = `${API_URL}/user_infos`;
const TUITIONS = `${API_URL}/tuitions`;
const INSTITUTIONS = `${API_URL}/institutions`;
const COURSES = `${API_URL}/courses`;
<<<<<<< HEAD
const GLOGIN = `${API_URL}/google-login`;

export { API_URL, RESOURCES, EDUAPP_SESSIONS, USERS, USERS_INFO, TUITIONS ,INSTITUTIONS, COURSES ,GLOGIN};
=======
const GLOGIN = `${API_URL}/users/auth/google_oauth2/callback`;
const CHAT_MESSAGES = `${API_URL}/chat_messages`;
const CHAT_PARTICIPANTS = `${API_URL}/chat_participants`;
const CALENDAR = `${API_URL}/calendar_annotations`;
const CALENDAR_USER_ID = `${API_URL}/calendar_annotations?user_id=`;
const SUBJECT = `${API_URL}/subjects`;

export {
  API_URL,
  RESOURCES,
  EDUAPP_SESSIONS,
  USERS,
  USERS_INFO,
  TUITIONS,
  INSTITUTIONS,
  COURSES,
  CALENDAR,
  CALENDAR_USER_ID,
  SUBJECT,
  CHAT_MESSAGES,
  CHAT_PARTICIPANTS,
  GLOGIN
};
>>>>>>> fff524c6bfcd78c71e58cc7b37288cdd5d3c6b14
