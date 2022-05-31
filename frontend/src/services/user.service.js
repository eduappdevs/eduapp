import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const USERS_INFO = `${API_URL}/user_infos`;
export const USERS = `${API_URL}/users`;
export const GLOGIN = `${API_URL}/users/auth/google_oauth2/callback`;
export const SYSTEM = `${API_URL}/system/user`;

const requestHeader = { eduauth: TOKEN };

//User
export const fetchUserInfos = async () => {
  return await axios.get(`${USERS_INFO}`, { headers: requestHeader });
};

export const findById = async (uId) => {
  return await axios.get(`${USERS_INFO}?user_id=${uId}`, {
    headers: requestHeader,
  });
};

export const fetchSystemUser = async () => {
  return await axios.get(`${SYSTEM}`, {
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
  return await axios.post(`${USERS}`, body, { headers: requestHeader });
};

export const deleteUser = async (id) => {
  return await axios.delete(`${USERS}/remove/${id}`, {
    headers: requestHeader,
  });
};

export const editUserInfo = async (uId, body) => {
  let info = await axios.get(`${USERS_INFO}?user_id=${uId}`, {
    headers: requestHeader,
  });

  return await axios.put(`${USERS_INFO}/${info.data[0].id}`, body, {
    headers: requestHeader,
  });
};

export const enroll_teacher = async (uId, subject_id) => {
  return await axios.post(`${USERS_INFO}/add_subject/${uId}/${subject_id}`, {
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

// Google Management

export const addGoogleId = async (uId, data) => {
  let info = await axios.get(`${USERS_INFO}?user_id=${uId}`, {
    headers: requestHeader,
  });

  let finaldata = new FormData();
  await axios.put(`${USERS_INFO}/${info.data[0].id}`, data);
  finaldata.append("isLoggedWithGoogle", true);
  return await axios.put(`${USERS_INFO}/${info.data[0].id}`, finaldata);
};

export const unlinkGoogleId = async (userId, body) => {
  let finaldata = new FormData();
  await axios.put(`${USERS_INFO}/${userId}`, body);
  finaldata.append("isLoggedWithGoogle", false);
  return await axios.put(`${USERS_INFO}/${userId}`, finaldata);
};

export const googleLogin = async (data) => {
  return await axios.post(`${GLOGIN}`, data);
};
