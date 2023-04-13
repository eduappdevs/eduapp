import axios from "axios";
import { API_URL, TOKEN, PING } from "../API";
export const INSTITUTIONS = `${API_URL}/institutions`;
const requestHeader = { eduauth: TOKEN };

//Institutions
export const institutionCreated = async () => {
  return (await axios.get(`${PING}/created`)).data.created;
};

export const fetchInstitutions = async () => {
  return await axios.get(`${INSTITUTIONS}`, { headers: requestHeader });
};

export const fetchInstitution = async (id) => {
  return await axios.get(`${INSTITUTIONS}/${id}`, { headers: requestHeader });
};

export const createInstitution = async (body) => {
  return await axios.post(`${INSTITUTIONS}`, body, { headers: requestHeader });
};

export const deleteInstitution = async (id) => {
  return await axios.delete(`${INSTITUTIONS}` + `/${id}`, {
    headers: requestHeader,
  });
};

export const editInstitution = async (body) => {
  return await axios.put(`${INSTITUTIONS}/${body.id}`, body, {
    headers: requestHeader,
  });
};
