import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const RESOURCE = `${API_URL}/resources`;
const requestHeader = { eduauth: TOKEN };

export const fetchResources = async () => {
  return axios.get(RESOURCE, { headers: requestHeader });
};

export const createResources = async (body) => {
  return axios.post(RESOURCE, body, { headers: requestHeader });
};

export const editResources = async (body) => {
  return axios.put(`${RESOURCE}/${body.id}`, body, { headers: requestHeader });
};

export const deleteResources = async (id) => {
  return axios.delete(`${RESOURCE}/${id}`, { headers: requestHeader });
};

export const fetchResourcesJson = async () => {
  return await (await fetch(RESOURCE)).json();
};
