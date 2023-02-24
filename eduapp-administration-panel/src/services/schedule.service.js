import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
export const EVENTS = `${API_URL}/calendar_annotations`;
export const SESSIONS = `${API_URL}/eduapp_user_sessions`;

const requestHeader = { eduauth: TOKEN };

export const fetchEvents = async () => {
  return await axios.get(EVENTS, { headers: requestHeader });
};

export const pagedEvents = async (page, order) => {
  return await axios.get(
    `${EVENTS}?page=${page}&order=${btoa(JSON.stringify(order))}`,
    {
      headers: requestHeader,
    }
  );
};

export const filterEvents = async ({
  id = null,
  annotation_title = null,
  annotation_description = null,
  event_author = null,
  subject_name = null,
  page = 1,
  extras = null,
}) => {
  return await axios.get(
    `${FILTER_URL}/events?id=${id}&annotation_title=${annotation_title}&annotation_description=${annotation_description}&event_author=${event_author}&subject_name=${subject_name}&page=${page}`,
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

export const pagedSessions = async (page, order = null, searchParams = null) => {
  const value = searchParams['query']
  const attribute = searchParams['selectedField']
  const extras = searchParams['extras']
  return await axios.get(
    `${SESSIONS}?page=${page}${value && attribute ? ('&' + attribute + '=' + value) : ''}&order=${btoa(JSON.stringify(order))}${extras ? '&extras=' + extras : ''}`,
    {
      headers: requestHeader,
    }
  );
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
    `${SESSIONS}?id=${id}&session_name=${session_name}&streaming_platform=${streaming_platform}&resources_platform=${resources_platform}&session_chat_id=${session_chat_id}&subject_name=${subject_name}&page=${page}&extras=${extras}`,
    {
      headers: requestHeader,
    }
  );
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
