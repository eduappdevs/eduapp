import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const USERS_INFO = `${API_URL}/user_infos`;
export const USERS = `${API_URL}/users`;
export const SYSTEM = `${API_URL}/system/user`;

const requestHeader = { eduauth: TOKEN };

//User
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
  return await axios.put(`${USERS}/${body.id}`, body, {
    headers: requestHeader,
  });
};

export const fetchSystemUser = async () => {
  return await axios.get(`${SYSTEM}`, {
    headers: requestHeader,
  });
};

export const enroll_teacher = async (uId, subject_id) => {
  return await axios.request({
    url: USERS_INFO + `/add_subject/${uId}/${subject_id}`,
    method: "POST",
    headers: requestHeader,
  });
};

export const delist_teacher = async (uId, subject_id) => {
  return await axios.delete(
    `${USERS_INFO}/remove_subject/${uId}/${subject_id}`,
    {
      headers: requestHeader,
    }
  );
};

export const findByName = async (name) => {
  return await axios.get(`${USERS_INFO}?name=${name}`, {
    headers: requestHeader,
  });
};
