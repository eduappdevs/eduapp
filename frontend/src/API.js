import axios from "axios";
import {
  API_URL,
  RESOURCES,
  EDUAPP_SESSIONS,
  USERS,
  USERS_INFO,
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
  createUser: async (body) => {
    const endpoint = `${USERS}`;
    return await await axios.post(endpoint, body);
  },
  login: async (body) => {
    const endpoint = `${USERS}/sign_in`;
    return await await axios.post(endpoint, body).then((res) => {
      saveInLocalStorage(res);
    });
  },
  logout: async () => {
    const endpoint = `${USERS}/sign_out`;
    console.log(endpoint, {
      headers: { Authorization: localStorage.userToken }})
    return await await axios.delete(endpoint, {
      headers: { Authorization: localStorage.userToken },
    });
  },
  // User Info
  fetchInfo: async (userId) => {
    const endpoint = `${USERS_INFO}/${userId}`;
    console.log(endpoint);
    return await (await fetch(endpoint)).json();
  },
  createInfo: async (body) => {
    const endpoint = `${USERS_INFO}`;
    console.log(endpoint);
    return await await axios.post(endpoint, body);
  },
  deleteInfo: async (infoId) => {
    const endpoint = `${USERS_INFO}/${infoId}`;
    return await await axios.delete(endpoint);
  },
  updateInfo: async (infoId, body) => {
    const endpoint = `${USERS_INFO}/${infoId}`;
    return await await axios.put(endpoint, body);
  },
};
export default apiSettings;
