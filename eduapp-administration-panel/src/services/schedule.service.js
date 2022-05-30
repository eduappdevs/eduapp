import axios from "axios";
import { API_URL, token } from "../API";
export const EVENTS = `${API_URL}/calendar_annotations`;
export const SESSIONS = `${API_URL}/eduapp_user_sessions`;

const requestHeader = { Authorization: token };

export const fetchEvents = async () => {
  return await axios.get(EVENTS, { headers: requestHeader });
};

export const createEvent = async (body) => {
  return await axios.post(EVENTS, body, { headers: requestHeader });
};

export const deleteEvent = async (body) => {
  return await axios.delete(`${EVENTS}/${body}`, { headers: requestHeader });
};

export const editEvent = async (body) => {
  return await axios.put(`${EVENTS}/${body.id}`, body, { headers: requestHeader })
}

export const fetchSessions = async () => {
  return await axios.get(SESSIONS, { headers: requestHeader });
};

export const createSession = async (body) => {
  return await axios.post(SESSIONS, body, { headers: requestHeader });
};

export const createSessionBatch = async (body) => {
  return await axios.post(`${SESSIONS}/batch_load`, body, { headers: requestHeader });
};

export const deleteSession = async (id) => {
  return await axios.delete(`${SESSIONS}/${id}`, { headers: requestHeader });
};

export const editSession = async (body) => {
  return await axios.put(`${SESSIONS}/${body.id}`, body, { headers: requestHeader });
};
