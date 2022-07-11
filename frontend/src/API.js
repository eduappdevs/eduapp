import axios from "axios";
import { USERS_INFO, GLOGIN, PING } from "./config";

export const API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
export const TOKEN = "Bearer " + localStorage.eduapp_auth;

const GoogleSettings = {
  //Google
  loginWithGoogle: async (data) => {
    console.log(data);
    const endpoint = `${GLOGIN}`;
    return await axios.post(endpoint, data).then((res) => {
      console.log(res);
    });
  },

  chechToken: async (token) => {
    const endpoint = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`;
    return await (await fetch(endpoint)).json();
  },

  addGoogleId: async (userId, body) => {
    const endpoint = `${USERS_INFO}/${userId}`;
    let finaldata = new FormData();
    return await axios.put(endpoint, body).then(() => {
      finaldata.append("isLoggedWithGoogle", true);
      axios.put(endpoint, finaldata).then(() => {
        window.location.reload();
      });
    });
  },

  unlinkGoogleId: async (userId, body) => {
    const endpoint = `${USERS_INFO}/${userId}`;
    let finaldata = new FormData();
    return await axios.put(endpoint, body).then(() => {
      finaldata.append("isLoggedWithGoogle", false);
      axios.put(endpoint, finaldata).then(() => {
        window.location.reload();
      });
    });
  },
};

export default GoogleSettings;

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

      return requestFunction.call();
    } catch (err) {
      if (err.toString().includes("Network Error"))
        await new Promise((res) => setTimeout(res, 2000));
      tries++;
      continue;
    }
  }

  return true;
};
