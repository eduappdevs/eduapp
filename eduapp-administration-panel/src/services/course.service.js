import axios from "axios";
import { API_URL, TOKEN } from "../API";
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

export const editCourse = async (body) => {
  return await axios.put(`${`${COURSES}`}/${body.id}`, body, {
    headers: requestHeader,
  });
};
