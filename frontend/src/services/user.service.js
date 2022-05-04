import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const USERS_INFO = `${API_URL}/user_infos`;
export const USERS = `${API_URL}/users`;

const requestHeader = { Authorization: TOKEN };

//User
export const fetchUserInfos = async () => {
  return await axios.get(`${USERS_INFO}`, { headers: requestHeader });
};

export const findById = async (uId) => {
	return await axios.get(`${USERS_INFO}?user_id=${uId}`, { headers: requestHeader });
}

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

export const editUser = async (body) => {
  return await axios.put(`${USERS}/${body.id}`, body, {
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
}
