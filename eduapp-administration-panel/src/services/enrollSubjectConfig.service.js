import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
export const SUBJECTS_USERS = `${API_URL}/subjects_users`;
const requestHeader = { eduauth: TOKEN };

export const fetchSubjectsUsers = async () => {
  return await axios.get(SUBJECTS_USERS, { headers: requestHeader });
};

export const pagedSubjectsUsers = async (page, order = null, searchParams = {}) => {
  const value = searchParams['query']
  const attribute = searchParams['selectedField']
  const extras = searchParams['extras']
  const auxOrder = searchParams['order'] || "asc"
  return await axios.get(`${SUBJECTS_USERS}?page=${page}${value && attribute ? ('&' + attribute + '=' + value) : ''}${auxOrder ? ('&order=' + auxOrder) : '' }`, {
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
  return await axios.post(SUBJECTS_USERS, body, { headers: requestHeader });
};

export const deleteSubjectUser = async (id) => {
  return await axios.delete(`${SUBJECTS_USERS}/${id}`, { headers: requestHeader });
};

export const editSubjectUser = async (body) => {
  return await axios.put(`${SUBJECTS_USERS}/${body.id}`, body, {
    headers: requestHeader,
  });
};
