import axios from "axios";
const API_URL = "http://localhost:3000";
const USERS = `${API_URL}/users`;
const INSTITUTIONS = `${API_URL}/institutions`;
const COURSES = `${API_URL}/courses`;

const saveInLocalStorage = (userDetails) => {
  if (userDetails.data.message.id == null) {
    throw "error";
  }

  localStorage.setItem("userId", userDetails.data.message.id);
  localStorage.setItem("userToken", userDetails.headers.authorization);
};

const apiSettings = {
  login: async (body) => {
    const endpoint = `${USERS}/sign_in`;
    return await await axios.post(endpoint, body).then((res) => {
      saveInLocalStorage(res);
    });
  },
  //User
  createUser: async (body) => {
    const endpoint = `${USERS}`;
    return await await axios.post(endpoint, body);
  },
  deleteUser: async (body) => {
    const endpoint = `${USERS}`;
    return await await axios.delete(endpoint, {
      headers: { Authorization: localStorage.userToken },
    });
  },
  editUser: async (body) => {
    const endpoint = `${USERS}`;
    return await await axios.put(endpoint, body);
  },
  //Institutions
  createInstitution: async (body) => {
    const endpoint = `${INSTITUTIONS}`;
    return await await axios.post(endpoint, body);
  },
  deleteInstitution: async (body) => {
    const endpoint = `${INSTITUTIONS}`;
    return await await axios.delete(endpoint, {
      headers: { Authorization: localStorage.userToken },
    });
  },
  editInstitution: async (body) => {
    const endpoint = `${INSTITUTIONS}`;
    return await await axios.put(endpoint, body);
  },
  //Courses
  createCourse: async (body) => {
    const endpoint = `${COURSES}`;
    return await await axios.post(endpoint, body);
  },
  deleteCourse: async (body) => {
    const endpoint = `${COURSES}`;
    return await await axios.delete(endpoint, {
      headers: { Authorization: localStorage.userToken },
    });
  },
  editCourse: async (body) => {
    const endpoint = `${COURSES}`;
    return await await axios.put(endpoint, body);
  },
};

export default apiSettings;
