import axios from "axios";

export const API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
export const JSREPORT = process.env.REACT_APP_REPORTS_ENDPOINT;
export const PING = `${API_URL}/ping`;
export const FILTER_URL = `${API_URL}`;
export const TOKEN = "Bearer " + localStorage.getItem("eduapp_auth");

/**
 * Tries pinging the server a total of (default) 5 total times
 * before executing the desired request.
 *
 * If it fails, it means it didn't reach the server in time.
 *
 * @param {Function} requestFunction
 * @returns {Boolean} true if it runs into an error.
 */
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
