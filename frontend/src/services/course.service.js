import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const COURSES = `${API_URL}/courses`;

const requestHeader = { Authorization: TOKEN };

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
