import axios from "axios";
import { API_URL, FILTER_URL, TOKEN } from "../API";
const requestHeader = { eduauth: TOKEN };

const COURSES = `${API_URL}/courses`;

//Courses
export const fetchCourses = async () => {
  return await axios.get(`${COURSES}`, { headers: requestHeader });
};

export const createCourse = async (body) => {
  return await axios.post(`${COURSES}`, body, { headers: requestHeader });
};

export const deleteCourse = async (id) => {
  return await axios.delete(`${COURSES}/${id}`, {
    headers: requestHeader,
  });
};

export const filterCourses = async ({
  id = null,
  name = null,
  page = 1,
  extras = null,
}) => {
  return await axios.get(
    `${FILTER_URL}/courses?id=${id}&name=${name}&page=${page}&extras=${extras}`,
    {
      headers: requestHeader,
    }
  );
};

export const fetchGeneralCourse = async () => {
  return await axios.get(`${COURSES}?name=General`, { headers: requestHeader });
};

export const editCourse = async (body) => {
  return await axios.put(`${`${COURSES}`}/${body.id}`, body, {
    headers: requestHeader,
  });
};

export const pagedCourses = async (page, order = null) => {
  return await axios.get(
    `${COURSES}?page=${page}&order=${btoa(JSON.stringify(order))}`,
    {
      headers: requestHeader,
    }
  );
};
