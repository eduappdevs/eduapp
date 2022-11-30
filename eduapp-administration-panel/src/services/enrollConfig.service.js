import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
export const TUITIONS = `${API_URL}/tuitions`;
const requestHeader = { eduauth: TOKEN };

export const fetchTuitions = async () => {
  return await axios.get(TUITIONS, { headers: requestHeader });
};

export const pagedTuitions = async (page, searchParams = {}) => {
  const value = searchParams['query']
  const attribute = searchParams['selectedField']
  const extras = searchParams['extras']
  const order = searchParams['order'] || "asc"
  return await axios.get(`${TUITIONS}?page=${page}${value && attribute ? ('&' + attribute + '=' + value) : ''}${order ? ('&order=' + order) : '' }`, {
    headers: requestHeader,
    data: extras,
  });
};

export const filterTuitions = async ({
  user_email = null,
  course_name = null,
  page = 1,
  extras = null,
  order = "asc",
}) => {
  return await axios.get(
    `${FILTER_URL}/tuitions?course_name=${course_name}&user_email=${user_email}&page=${page}&order=${order}`,
    {
      headers: requestHeader,
      data: extras,
    }
  );
};

export const createTuition = async (body) => {
  return await axios.post(TUITIONS, body, { headers: requestHeader });
};

export const deleteTuition = async (id) => {
  return await axios.delete(`${TUITIONS}/${id}`, { headers: requestHeader });
};

export const editTuition = async (body) => {
  return await axios.put(`${TUITIONS}/${body.id}`, body, {
    headers: requestHeader,
  });
};
