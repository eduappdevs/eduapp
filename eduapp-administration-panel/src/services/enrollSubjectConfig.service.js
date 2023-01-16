import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
export const SUBJECTSUSERS = `${API_URL}/subjects_users`;
const requestHeader = { eduauth: TOKEN };

export const fetchSubjectsUsers = async () => {
  return await axios.get(SUBJECTSUSERS, { headers: requestHeader });
};

export const pagedSubjectsUsers = async (page, searchParams = {}) => {
  const value = searchParams['query']
  const attribute = searchParams['selectedField']
  const extras = searchParams['extras']
  const order = searchParams['order'] || "asc"
  return await axios.get(`${SUBJECTSUSERS}?page=${page}${value && attribute ? ('&' + attribute + '=' + value) : ''}${order ? ('&order=' + order) : '' }`, {
    headers: requestHeader,
    data: extras,
  });
};

export const filterSubjectsUsers = async ({
  user_email = null,
  subject_name = null,
  page = 1,
  extras = null,
  order = "asc",
}) => {
  return await axios.get(
    `${FILTER_URL}/subjects_users?subject_name=${subject_name}&user_email=${user_email}&page=${page}&order=${order}`,
    {
      headers: requestHeader,
      data: extras,
    }
  );
};

export const createSubjectUser = async (body) => {
  return await axios.post(SUBJECTSUSERS, body, { headers: requestHeader });
};

export const deleteSubjectUser = async (id) => {
  return await axios.delete(`${SUBJECTSUSERS}/${id}`, { headers: requestHeader });
};

export const editSubjectUser = async (body) => {
  return await axios.put(`${SUBJECTSUSERS}/${body.id}`, body, {
    headers: requestHeader,
  });
};
