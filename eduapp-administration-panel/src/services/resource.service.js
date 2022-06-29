import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
export const RESOURCE = `${API_URL}/resources`;
const requestHeader = { eduauth: TOKEN };

export const fetchResources = async () => {
  return axios.get(RESOURCE, { headers: requestHeader });
};

export const filterResources = async ({
  id = null,
  name = null,
  author = null,
  subject_name = null,
  page = 1,
  extras = null,
  order = "asc",
}) => {
  return await axios.get(
    `${FILTER_URL}/resources?id=${id}&name=${name}&author=${author}&subject_name=${subject_name}&page=${page}&order=${order}`,
    {
      headers: requestHeader,
      data: extras,
    }
  );
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

export const pagedResources = async (page) => {
  return await axios.get(`${RESOURCE}?page=${page}`, {
    headers: requestHeader,
  });
};
