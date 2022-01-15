import axios from "axios";
import {
  API_URL,
  RESOURCES,
  EDUAPP_SESSIONS,
  USERS,
  USERS_INFO,
  TUITIONS,
} from "./config";

const saveInLocalStorage = (userDetails) => {
  if (userDetails.data.message.id == null) {
    throw "error";
  }

  localStorage.setItem("userId", userDetails.data.message.id);
  localStorage.setItem("userToken", userDetails.headers.authorization);
};

const apiSettings = {
  //Resources
  fetchResources: async () => {
    const endpoint = `${RESOURCES}`;
    return await (await fetch(endpoint)).json();
  },
  postResource: async (body) => {
    const endpoint = `${RESOURCES}`;
    return await await axios.post(endpoint, body, {
      headers: { Authorization: localStorage.userToken },
    });
  },
  deleteResource: async (resource_id) => {
    const endpoint = `${RESOURCES}/${resource_id}`;
    return await await axios.delete(endpoint, {
      headers: { Authorization: localStorage.userToken },
    });
  },

  //User
  login: async (body) => {
    const endpoint = `${USERS}/sign_in`;
    return await await axios.post(endpoint, body).then((res) => {
      saveInLocalStorage(res);
    });
  },
  logout: async () => {
    const endpoint = `${USERS}/sign_out`;
    return await await axios
      .delete(endpoint, {
        headers: { Authorization: localStorage.userToken },
      })
      .then((res) => {
        console.log("logged out");
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("userId");
        localStorage.removeItem("userToken");
        window.location.reload();
      });
  },
  // User Info

  fetchInfo: async (userId) => {
    const endpoint = `${USERS_INFO}/${userId}`;
    return await (await fetch(endpoint)).json();
  },
  deleteInfo: async (infoId) => {
    const endpoint = `${USERS_INFO}/${infoId}`;
    return await await axios.delete(endpoint);
  },
  updateInfo: async (infoId, body) => {
    const endpoint = `${USERS_INFO}/${infoId}`;
    return await await axios.put(endpoint, body);
  },

  //User courses
  getCourses: async () => {
    const endpoint = `${TUITIONS}`;
    let courses = [];
    await await axios.get(endpoint).then((res) => {
      res.data.map((course) => {
        if (course.user_id.toString() === localStorage.userId) {
          return courses.push(course);
        }
      });
    });
    return courses;
  },
  //Session
  deleteSession: async (sessionId) =>{
    const endpoint = `${EDUAPP_SESSIONS}/${sessionId}`;

    return await await axios.delete(endpoint,{
      headers: { Authorization: localStorage.userToken },
    })
  },

};
export default apiSettings;
