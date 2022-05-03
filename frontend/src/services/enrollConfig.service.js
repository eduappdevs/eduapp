import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const TUITIONS = `${API_URL}/tuitions`;

const requestHeader = { Authorization: TOKEN };

export const fetchTuitions = async () => {
  return axios.get(TUITIONS, { headers: requestHeader });
};

export const createTuition = async (body) => {
  return axios.post(TUITIONS, body, { headers: requestHeader });
};

export const deleteTuition = async (id) => {
  return axios.delete(`${TUITIONS}/${id}`, { headers: requestHeader });
};

export const editTuition = async (body) => {
  return axios.put(`${TUITIONS}/${body.id}`, body, { headers: requestHeader });
};
