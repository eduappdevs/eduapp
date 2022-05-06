import axios from "axios";
import { API_URL, token } from "../API";
export const TUITIONS = `${API_URL}/tuitions`;

const requestHeader = { Authorization: token };

export const fetchTuitions = async () => {
  return await axios.get(TUITIONS, { headers: requestHeader });
};

export const createTuition = async (body) => {
  return await axios.post(TUITIONS, body, { headers: requestHeader });
};

export const deleteTuition = async (id) => {
  return await axios.delete(`${TUITIONS}/${id}`, { headers: requestHeader });
};

export const editTuition = async (body) => {
  return await axios.put(`${TUITIONS}/${body.id}`, body, { headers: requestHeader });
};
