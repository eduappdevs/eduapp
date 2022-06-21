import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const ROLES = `${API_URL}/user_roles`;

const requestHeader = { eduauth: TOKEN };

export const pagedUserRoles = async (page) => {
  return (await axios.get(`${ROLES}?page=${page}`, { headers: requestHeader }))
    .data;
};

export const fetchRoles = async () => {
  return (await axios.get(ROLES, { headers: requestHeader })).data;
};

export const createRole = async (role) => {
  return await axios.post(ROLES, role, { headers: requestHeader });
};

export const deleteRole = async (id) => {
  return await axios.delete(`${ROLES}/${id}`, { headers: requestHeader });
};
