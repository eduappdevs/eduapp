import axios from "axios";
import { API_URL, token } from '../API'
const requestHeader = { Authorization: token }

const COURSES = `${API_URL}/courses`;


//Courses
export const fetchCourses = async () => {
    const endpoint = `${COURSES}`;
    return await axios.get(endpoint, { headers: requestHeader });
}

export const createCourse = async (body) => {
    const endpoint = `${COURSES}`;
    return await axios.post(endpoint, body, { headers: requestHeader });
}

export const deleteCourse = async (body) => {
    const endpoint = `${COURSES}`;
    return await axios.delete(endpoint, {
        headers: requestHeader,
    });
}

export const editCourse = async (body) => {
    const endpoint = `${COURSES}`;
    return await axios.put(endpoint, body, { headers: requestHeader });
}