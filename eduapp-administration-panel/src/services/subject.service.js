import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
export const SUBJECTS = `${API_URL}/subjects`;
const requestHeader = { eduauth: TOKEN };

//subject
export const fetchSubjects = async () => {
  return await axios.get(`${SUBJECTS}`, { headers: requestHeader });
};

export const fetchSubject = async (id) => {
  return await axios.get(`${SUBJECTS}?subject_id=${id}`, {
    headers: requestHeader,
  });
};

export const getGeneralSubject = async () => {
  return await axios.get(`${SUBJECTS}/?name=General`, {
    headers: requestHeader,
  });
};

export const filterCourses = async ({
  id = null,
  name = null,
  subject_code = null,
  course_name = null,
  page = 1,
  extras = btoa(null),
}) => {
  return await axios.get(
    `${FILTER_URL}/subjects?id=${id}&name=${name}&subject_code=${subject_code}&course_name=${course_name}&page=${page}&extras=${extras}`,
    {
      headers: requestHeader,
    }
  );
};

export const createSubject = async (body) => {
  return await axios.post(`${SUBJECTS}`, body, { headers: requestHeader });
};

export const deleteSubject = async (id) => {
  return await axios.delete(`${SUBJECTS}/${id}`, { headers: requestHeader });
};

export const deleteSubjectEnrollment = async (body) => {
  const url = body.user_id
    ? `${SUBJECTS}/${body.id}/users/${body.user_id}`
    : `${SUBJECTS}/${body.id}`;
  return await axios.delete(url, {
    headers: requestHeader,
  });
};

export const editSubject = async (body) => {
  return await axios.put(`${SUBJECTS}/${body.id}`, body, {
    headers: requestHeader,
  });
};

export const pagedSubjects = async (page, order = null, searchParams = []) => {
  const value = searchParams["query"];
  const attribute = searchParams["selectedField"];
  const extras = searchParams["extras"];
  return await axios.get(
    `${SUBJECTS}?page=${page}${
      value && attribute ? "&" + attribute + "=" + value : ""
    }&order=${btoa(JSON.stringify(order))}${extras ? "&extras=" + extras : ""}`,
    {
      headers: requestHeader,
    }
  );
};
