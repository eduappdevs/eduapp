import axios from "axios";
import { API_URL } from "../API";
import { getOfflineUser } from "../utils/OfflineManager";
export const USERS = `${API_URL}/users`;

export const saveInLocalStorage = (userDetails) => {
  if (userDetails.data.message.id == null) {
    throw new Error("error");
  }

  let offlineUser = {
    user: userDetails.data.message,
  };

  localStorage.setItem("offline_user", JSON.stringify(offlineUser));
  localStorage.setItem(
    "eduapp_auth",
    userDetails.headers.authorization.substring(7)
  );
  window.location.reload();
};

export const login = async (body) => {
  return await axios.post(`${USERS}/sign_in`, body).then((res) => {
    console.log(res.data.message);
    if (res.data.message.isAdmin !== true)
      console.warn("User is not administrator!");

    saveInLocalStorage(res);
  });
};

export const hasInit = async () => {
  return await axios.get(`${API_URL}/ping/admin`);
};

export const logout = async () => {
  return await axios
    .delete(`${USERS}/sign_out`, {
      headers: { Authorization: getOfflineUser().token },
    })
    .then(() => {
      localStorage.removeItem("eduapp_auth");
      localStorage.removeItem("offline_user");

      window.location.href = "/login";
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("eduapp_auth");
      localStorage.removeItem("offline_user");

      window.location.href = "/login";
    });
};
