import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const SUBJECTSUSERS = `${API_URL}/subjects_users`;
const requestHeader = { eduauth: TOKEN };

export const fetchSubjectUsers = async () => {
  return await axios.get(SUBJECTSUSERS, { headers: requestHeader });
};

export const fetchUserSubjectUsers = async (id) => {
  return await axios.get(`${SUBJECTSUSERS}?user_id=${id}`, { headers: requestHeader })
};
