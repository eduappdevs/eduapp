import axios from "axios";
import { API_URL, TOKEN, FILTER_URL } from "../API";
export const USERS_INFO = `${API_URL}/user_infos`;
export const USERS = `${API_URL}/users`;
export const SYSTEM = `${API_URL}/system/user`;
const requestHeader = { eduauth: TOKEN };

export const fetchUserInfos = async () => {
  return await axios.get(`${USERS_INFO}`, { headers: requestHeader });
};

export const pagedUserInfos = async (page) => {
  return await axios.get(`${USERS_INFO}?page=${page}`, {
    headers: requestHeader,
  });
};

export const createInfo = async (body) => {
  return await axios.post(`${USERS_INFO}`, body, { headers: requestHeader });
};

export const fetchUser = async () => {
  return await axios.get(`${USERS}`, { headers: requestHeader });
};

export const createUser = async (body) => {
  return await axios.post(`${USERS}`, body);
};

export const deleteUser = async (id) => {
  return await axios.delete(`${USERS}/remove/${id}`, {
    headers: requestHeader,
  });
};

export const editUser = async (body) => {
  return await axios.put(`${USERS_INFO}/${body.id}`, body, {
    headers: requestHeader,
  });
};

export const fetchSystemUser = async () => {
  return await axios.get(`${SYSTEM}`, {
    headers: requestHeader,
  });
};

export const filterUsers = async ({
  user_id = null,
  user_name = null,
  email = null,
  role = null,
  page = 1,
  extras = null,
  order = "asc",
}) => {
  return await axios.get(
    `${FILTER_URL}/user_infos?user_id=${user_id}&user_name=${user_name}&email=${email}&role=${role}&page=${page}&order=${order}`,
    {
      headers: requestHeader,
      data: extras,
    }
  );
};

export const filterTeachers = async ({
  teacher_name = null,
  subject_name = null,
  page = 1,
  extras = null,
  order = "asc",
}) => {
  return await axios.get(
    `${FILTER_URL}/teachers?teacher_name=${teacher_name}&subject_name=${subject_name}&page=${page}&order=${order}`,
    {
      headers: requestHeader,
      data: extras,
    }
  );
};

export const enroll_teacher = async (uId, subject_id) => {
  return await axios.request({
    url: USERS_INFO + `/add_subject/${uId}/${subject_id}`,
    method: "POST",
    headers: requestHeader,
  });
};

export const global_events = async (uId) => {
  return await axios.request({
    url: USERS_INFO + `/global_events/${uId}`,
    method: "POST",
    headers: requestHeader,
  });
};

export const remove_global_events = async (uId, event_id) => {
  return await axios.delete(
    `${USERS_INFO}/remove_global_events/${uId}/${event_id}`,
    {
      headers: requestHeader,
    }
  );
};

export const delist_teacher = async (uId, subject_id) => {
  return await axios.delete(
    `${USERS_INFO}/remove_subject/${uId}/${subject_id}`,
    {
      headers: requestHeader,
    }
  );
};

export const editTeacher = async (body) => {
  return await axios.put(`${USERS_INFO}/${body.id}`, body, {
    headers: requestHeader,
  });
};

export const findByName = async (name) => {
  return await axios.get(`${USERS_INFO}?name=${name}`, {
    headers: requestHeader,
  });
};
