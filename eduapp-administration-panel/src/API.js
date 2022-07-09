import axios from "axios";

export const API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
export const JSREPORT = process.env.REACT_APP_REPORTS_ENDPOINT;
export const PING = `${API_URL}/ping`;
export const FILTER_URL = `${API_URL}/filter`;
export const TOKEN = "Bearer " + localStorage.getItem("eduapp_auth");

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

export default asynchronizeRequest;
