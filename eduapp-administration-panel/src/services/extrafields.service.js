import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const EXTRAFIELDS = `${API_URL}/extrafields`;
const requestHeader = { eduauth: TOKEN };

export const getExtraFields = async (data) => {
  return await axios.get(`${EXTRAFIELDS}/${data.table}/${data.id}`, {
    headers: requestHeader,
  });
};

export const pushExtraFields = async (data, body) => {
  return await axios.post(`${EXTRAFIELDS}/${data.table}/${data.id}`, body, {
    headers: requestHeader,
  });
};

export const updateExtraFields = async (data, body) => {
  return await axios.put(`${EXTRAFIELDS}/${data.table}/${data.id}`, body, {
    headers: requestHeader,
  });
};

export const deleteExtraFields = async (data) => {
  return await axios.delete(
    `${EXTRAFIELDS}/${data.table}/${data.id}/${data.name}`,
    {
      headers: requestHeader,
    }
  );
};
