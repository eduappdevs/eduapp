import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const INSTITUTIONS = `${API_URL}/institutions`;

const requestHeader = { Authorization: TOKEN };

//Institutions
export const fetchInstitutions = async () => {
  return await axios.get(`${INSTITUTIONS}`).then({ headers: requestHeader });
};

export const fetchInstitution = async (id) => {
  return await axios
    .get(`${INSTITUTIONS}/${id}`)
    .then({ headers: requestHeader });
};

export const createInstitution = async (body) => {
  return await axios
    .post(`${INSTITUTIONS}`, body)
    .then({ headers: requestHeader });
};

export const deleteInstitution = async (id) => {
  return await axios.delete(`${INSTITUTIONS}` + `/${id}`, {
    headers: requestHeader,
  });
};

export const editInstitution = async (body) => {
  return await axios
    .put(`${INSTITUTIONS}/${body.id}`, body)
    .then({ headers: requestHeader });
};
