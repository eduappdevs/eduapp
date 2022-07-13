export const API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
export const CHATWS = process.env.REACT_APP_WEBSOCKET_ENDPOINT;
export const SUPPORT = process.env.REACT_APP_SUPPORT_ENDPOINT;
export const PING = `${API_URL}/ping`;
export const USERS = `${API_URL}/users`;
export const RESOURCES = `${API_URL}/resources`;
export const EDUAPP_SESSIONS = `${API_URL}/eduapp_user_sessions`;
export const USERS_INFO = `${API_URL}/user_infos`;
export const TUITIONS = `${API_URL}/tuitions`;
export const INSTITUTIONS = `${API_URL}/institutions`;
export const COURSES = `${API_URL}/courses`;
export const GLOGIN = `${API_URL}/glogin`;
export const CHAT_BASE = `${API_URL}/chat_bases`;
export const CHAT_MESSAGES = `${API_URL}/chat_messages`;
export const CHAT_PARTICIPANTS = `${API_URL}/chat_participants`;
export const CALENDAR = `${API_URL}/calendar_annotations`;
export const CALENDAR_USER_ID = `${API_URL}/calendar_annotations?user_id=`;
export const SUBJECT = `${API_URL}/subjects`;

export const FIREBASE_CFG = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_SENDER_ID,
  appId: process.env.REACT_APP_FB_ID,
};

export const IMG_FLBK_USER = process.env.REACT_APP_USER_FALLBACK_IMG;
export const IMG_FLBK_GROUP = process.env.REACT_APP_GROUP_FALLBACK_IMG;
