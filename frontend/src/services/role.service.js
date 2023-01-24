import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const ROLES = `${API_URL}/user_roles`;

const requestHeader = { eduauth: TOKEN };

export const fetchRoles = async () => {
  return (await axios.get(ROLES, { headers: requestHeader })).data;
};

export const fetchRole = async (id) => {
  return (await axios.get(`${ROLES}/${id}`, { headers: requestHeader })).data;
};
