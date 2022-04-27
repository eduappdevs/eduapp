import axios from "axios";
export const API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
const JSREPORT = process.env.REACT_APP_REPORTS_ENDPOINT;
const USERS = `${API_URL}/users`;
const COURSES = `${API_URL}/courses`;
const USERS_INFO = `${API_URL}/user_infos`;
const TUITIONS = `${API_URL}/tuitions`;
const SESSIONS = `${API_URL}/eduapp_user_sessions`;
const PING = `${API_URL}/ping`;
const SUBJECTS = `${API_URL}/subjects`;
const INSTITUTIONS = `${API_URL}/institutions`;

const RESOURCES = `${API_URL}/resources`;

export const token = process.env.REACT_APP_TOKEN

const saveInLocalStorage = (userDetails) => {
  console.log(userDetails);
  if (userDetails.data.message.id == null) {
    throw new Error("error");
  }

  localStorage.setItem("userId", userDetails.data.message.id);
  localStorage.setItem("userToken", userDetails.headers.authorization);
};

const apiSettings = {
  login: async (body) => {
    const endpoint = `${USERS}/sign_in`;
    return await axios.post(endpoint, body).then((res) => {
      saveInLocalStorage(res);
    });
  },

  fetchResources: async () => {
    const endpoint = `${RESOURCES}`;
    return await (await fetch(endpoint)).json();
  },

  //User
  createUser: async (body) => {
    const endpoint = `${USERS}`;
    return await axios.post(endpoint, body);
  },

  fetchUserInfos: async () => {
    const endpoint = `${USERS_INFO}`;
    return await axios.get(endpoint);
  },

  createInfo: async (body) => {
    const endpoint = `${USERS_INFO}`;
    return await axios.post(endpoint, body);
  },

  deleteUser: async (body) => {
    const endpoint = `${USERS}`;
    return await axios.delete(endpoint, {
      headers: { Authorization: token },
    });
  },
  editUser: async (body) => {
    const endpoint = `${USERS}`;
    return await axios.put(endpoint, body);
  },

  //Institutions
  fetchInstitutions: async () => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.get(endpoint);
  },

  fetchInstitution: async (id) => {
    const endpoint = `${INSTITUTIONS}/${id}`;
    return await axios.get(endpoint);
  },

  createInstitution: async (body) => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.post(endpoint, body);
  },

  deleteInstitution: async (id) => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.delete(endpoint + `/${id}`, {
      headers: { Authorization: token },
    });
  },

  editInstitution: async (body) => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.put(endpoint, body);
  },

  //Courses
  fetchCourses: async () => {
    const endpoint = `${COURSES}`;
    return await axios.get(endpoint);
  },

  createCourse: async (body) => {
    const endpoint = `${COURSES}`;
    return await axios.post(endpoint, body);
  },

  deleteCourse: async (body) => {
    const endpoint = `${COURSES}`;
    return await axios.delete(endpoint, {
      headers: { Authorization: token },
    });
  },

  editCourse: async (body) => {
    const endpoint = `${COURSES}`;
    return await axios.put(endpoint, body);
  },

  //Users tuition
  enrollUser: async (body) => {
    const endpoint = `${TUITIONS}`;
    return await axios.post(endpoint, body);
  },

};

export default apiSettings;

export const endpoints = {
  JSREPORT,
  API_URL,
  USERS,
  INSTITUTIONS,
  COURSES,
  USERS_INFO,
  TUITIONS,
  PING,
  SUBJECTS,
  SESSIONS,
};

export const asynchronizeRequest = async (requestFunction) => {
  let tries = 0;
  const maxTries = 5;

  while (tries < maxTries) {
    try {
      await axios({
        method: "get",
        url: PING,
        timeout: 5000,
      });

      tries++;
      return requestFunction.call();
    } catch (err) {
      tries++;
      continue;
    }
  }

  if (tries < maxTries) return requestFunction.call();
  else throw new Error("Request failed after 5 tries");

};
