import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const RESOURCE = `${API_URL}/resources`;

const requestHeader = { eduauth: TOKEN };

export const fetchResources = async () => {
  return axios.get(RESOURCE, { headers: requestHeader });
};

export const findById = async (id) => {
	return axios.get(`${RESOURCE}/${id}`, { headers: requestHeader });
}

export const fetchSubjectResources = async (sId) => {
  return axios.get(`${RESOURCE}?subject_id=${sId}`, { headers: requestHeader });
};

export const createResource = async (body) => {
  return axios.post(RESOURCE, body, { headers: requestHeader });
};

export const editResource = async (body) => {
  return axios.put(`${RESOURCE}/${body.id}`, body, { headers: requestHeader });
};

export const deleteResource = async (rId) => {
  return axios.delete(`${RESOURCE}/${rId}`, { headers: requestHeader });
};

export const fetchResourcesJson = async () => {
  return await (await fetch(RESOURCE)).json();
};
