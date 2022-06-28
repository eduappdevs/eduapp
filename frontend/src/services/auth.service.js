import axios from "axios";
import { API_URL, TOKEN } from "../API";
import prefixUrl from "../utils/UrlPrefixer";
import { GLOGIN } from "../config";
export const USERS = `${API_URL}/users`;
export const saveInLocalStorage = (userDetails) => {
  console.log(userDetails)
  if (userDetails.data.message.id == null) {
    throw new Error("error");
  }

  localStorage.setItem(
    "offline_user",
    JSON.stringify(userDetails.data.message)
  );
  localStorage.setItem("eduapp_auth", userDetails.headers.eduauth.substring(7));
  window.location.reload();
};

export const login = async (body) => {
  return await axios.post(`${USERS}/sign_in`, body).then((res) => {
    saveInLocalStorage(res);
  });
};
export const link_with_google =  async (data) => {
  console.log(data)
  const endpoint = `${GLOGIN}/link`;
  return await axios.post(endpoint, data).then(window.location.reload());
};
export const unlink_with_google =  async (data) => {
  const endpoint = `${GLOGIN}/unlink`;
  return await axios.post(endpoint, data).then(window.location.reload())
};
export const login_with_google =  async (data) => {
  const endpoint = `${GLOGIN}/login`;
  return await axios.post(endpoint, data).then((res) => {
    saveInLocalStorage(res);
  });
};

export const logout = async () => {
  return await axios
    .delete(`${USERS}/sign_out`, {
      headers: { eduauth: TOKEN },
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      localStorage.removeItem("eduapp_auth");
      localStorage.removeItem("offline_user");
      localStorage.removeItem("previousMenuPage");
      localStorage.removeItem("resourceId");

      window.location.href = prefixUrl("/login");
    });
    
};

