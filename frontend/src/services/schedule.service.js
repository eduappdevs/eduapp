import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const EVENTS = `${API_URL}/calendar_annotations`;
export const SESSIONS = `${API_URL}/eduapp_user_sessions`;

const requestHeader = { eduauth: TOKEN };

export const fetchEvents = async () => {
  return await axios.get(EVENTS, { headers: requestHeader });
};

export const fetchUserEvents = async (userId) => {
  return await axios.get(`${EVENTS}?user_id=${userId}`, {
    headers: requestHeader,
  });
};

export const fetchEventsById = async (userId) => {
  return await axios.get(`${EVENTS}/${userId}/all`, { headers: requestHeader });
};

export const deleteEventById = async (id) => {
  return await axios.delete(`${EVENTS}/${id}`, { headers: requestHeader })
}

export const fetchCalendarEvent = async (userId) => {
  return await axios.get(`${EVENTS}/${userId}/event_pop`, { headers: requestHeader });
}

export const createEvent = async (body) => {
  return await axios.post(EVENTS, body, { headers: requestHeader });
};

export const deleteEvent = async (body) => {
  return await axios.delete(`${EVENTS}/${body}`, { headers: requestHeader });
};

export const editEvent = async (body) => {
  return await axios.put(`${EVENTS}/${body.id}`, body, {
    headers: requestHeader,
  });
};

export const fetchUserSessions = async (userId) => {
  return await axios.get(`${SESSIONS}?user_id=${userId}`, {
    headers: requestHeader,
  });
};

export const fetchSessions = async () => {
  return await axios.get(SESSIONS, { headers: requestHeader });
};

export const createSession = async (body) => {
  return await axios.post(SESSIONS, body, { headers: requestHeader });
};

export const deleteSession = async (id) => {
  return await axios.delete(`${SESSIONS}/${id}`, { headers: requestHeader });
};

export const editSession = async (body) => {
  return await axios.put(`${SESSIONS}/${body.id}`, body, {
    headers: requestHeader,
  });
};
