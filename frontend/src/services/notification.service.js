import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const NOTIFICATION_KEY = `${API_URL}/notification/key`;
export const NOTIFICATION_SUBSCRIPTION = `${API_URL}/notification/subscribe`;
export const NOTIFICATION_PUSH = `${API_URL}/notification/push`;


const requestHeader = { eduauth: TOKEN };

//Get public key
export const fetchPublicKey = async () => {
  return await axios.get(`${NOTIFICATION_KEY}`, { headers: requestHeader });
};

// Subscribe user
export const setNotificationSubscription = async (data) => {
  return await axios.post(`${NOTIFICATION_SUBSCRIPTION}`, data, { headers: requestHeader });
};

// Push notification A lo mejor no se utiliza
export const setNotificationPush = async (data) => {
  return await axios.post(`${NOTIFICATION_PUSH}`, data, { headers: requestHeader });
};
