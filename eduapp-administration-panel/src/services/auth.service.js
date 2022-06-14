import axios from "axios";
import { API_URL, TOKEN } from "../API";
import { saveUserOffline } from "../utils/OfflineManager";
import prefixUrl from "../utils/UrlPrefixer";
export const USERS = `${API_URL}/users`;

export const saveInLocalStorage = (userDetails) => {
  if (userDetails.data.message.id == null) {
    throw new Error("Login was not made correctly.");
  }

  saveUserOffline(userDetails.data.message);
  localStorage.setItem("eduapp_auth", userDetails.headers.eduauth.substring(7));
  window.location.reload();
};

export const login = async (body) => {
  return await axios.post(`${USERS}/sign_in`, body).then((res) => {
    let acceptedRoles = ["eduapp-admin", "eduapp-admin-query"];
    if (!acceptedRoles.includes(res.data.message.user_role.name)) {
      console.warn("User is not administrator!");
      return;
    }

    saveInLocalStorage(res);
  });
};

export const hasInit = async () => {
  return await axios.get(`${API_URL}/ping/admin`);
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

      window.location.href = prefixUrl("/login");
    });
};
