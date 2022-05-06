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
  const endpoint = `${USERS}/sign_in`;
  return await axios.post(endpoint, body).then((res) => {
    saveInLocalStorage(res);
  });
};

export const logout = async () => {
  const endpoint = `${USERS}/sign_out`;
  return await axios
    .delete(endpoint, {
      headers: { Authorization: getOfflineUser().token },
    })
    .then(() => {
      localStorage.removeItem("eduapp_auth");
      localStorage.removeItem("offline_user");
      localStorage.removeItem("previousMenuPage");
      localStorage.removeItem("resourceId");

      window.location.href = "/login";
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("eduapp_auth");
      localStorage.removeItem("offline_user");

      window.location.href = "/login";
    });
};
