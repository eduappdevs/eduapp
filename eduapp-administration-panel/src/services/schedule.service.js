import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
export const EVENTS = `${API_URL}/calendar_annotations`;
export const SESSIONS = `${API_URL}/eduapp_user_sessions`;

const requestHeader = { eduauth: TOKEN };

export const fetchEvents = async () => {
  return await axios.get(EVENTS, { headers: requestHeader });
};

export const pagedEvents = async (page) => {
  return await axios.get(`${EVENTS}?page=${page}`, {
    headers: requestHeader,
  });
};

export const filterSessions = async ({
  id = null,
  session_name = null,
  streaming_platform = null,
  resources_platform = null,
  session_chat_id = null,
  subject_name = null,
  page = 1,
  extras = null,
}) => {
  return await axios.get(
    `${FILTER_URL}/sessions?id=${id}&session_name=${session_name}&streaming_platform=${streaming_platform}&resources_platform=${resources_platform}&session_chat_id=${session_chat_id}&subject_name=${subject_name}&page=${page}`,
    {
      headers: requestHeader,
      data: extras,
    }
  );
};

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

export const fetchSessions = async () => {
  return await axios.get(SESSIONS, { headers: requestHeader });
};

export const pagedSessions = async (page) => {
  return await axios.get(`${SESSIONS}?page=${page}`, {
    headers: requestHeader,
  });
};

export const createSession = async (body) => {
  return await axios.post(SESSIONS, body, { headers: requestHeader });
};

export const createSessionBatch = async (body) => {
  return await axios.post(`${SESSIONS}/batch_load`, body, {
    headers: requestHeader,
  });
};

export const deleteSession = async (id) => {
  return await axios.delete(`${SESSIONS}/${id}`, { headers: requestHeader });
};

export const deleteGlobal = async (batch_id) => {
  return await axios.delete(`${SESSIONS}/batch_delete/${batch_id}`, {
    headers: requestHeader,
  });
};

export const editSession = async (body) => {
  return await axios.put(`${SESSIONS}/${body.id}`, body, {
    headers: requestHeader,
  });
};

export const editSessionBatch = async (body) => {
  return await axios.put(`${SESSIONS}/batch_update/${body.batch_id}`, body, {
    headers: requestHeader,
  });
};
