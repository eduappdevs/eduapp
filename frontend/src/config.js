const API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
const CHATWS = process.env.REACT_APP_WEBSOCKET_ENDPOINT;
const SUPPORT = process.env.REACT_APP_SUPPORT_ENDPOINT;
const PING = `${API_URL}/ping`;
const USERS = `${API_URL}/users`;
const RESOURCES = `${API_URL}/resources`;
const EDUAPP_SESSIONS = `${API_URL}/eduapp_user_sessions`;
const USERS_INFO = `${API_URL}/user_infos`;
const TUITIONS = `${API_URL}/tuitions`;
const INSTITUTIONS = `${API_URL}/institutions`;
const COURSES = `${API_URL}/courses`;
const GLOGIN = `${API_URL}/users/auth/google_oauth2/callback`;
const CHAT_MESSAGES = `${API_URL}/chat_messages`;
const CHAT_PARTICIPANTS = `${API_URL}/chat_participants`;
const CALENDAR = `${API_URL}/calendar_annotations`;
const CALENDAR_USER_ID = `${API_URL}/calendar_annotations?user_id=`;
const SUBJECT = `${API_URL}/subjects`;

const FIREBASE_CFG = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_SENDER_ID,
  appId: process.env.REACT_APP_FB_ID,
};

export {
  API_URL,
  FIREBASE_CFG,
  PING,
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
  GLOGIN,
  CHATWS,
  SUPPORT,
};
