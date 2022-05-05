import axios from "axios";
import { API_URL } from "../API";
export const USERS = `${API_URL}/users`;

export const saveInLocalStorage = (userDetails) => {
  if (userDetails.data.message.id == null) {
    throw new Error("error");
  }

  localStorage.setItem("userId", userDetails.data.message.id);
  localStorage.setItem("userToken", userDetails.headers.authorization);
};

export const login = async (body) => {
  const endpoint = `${USERS}/sign_in`;
  return await axios.post(endpoint, body).then((res) => {
    saveInLocalStorage(res);
  });
};
