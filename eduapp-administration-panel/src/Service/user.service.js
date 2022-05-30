import axios from "axios";
import { API_URL, token } from '../API'
export const USERS_INFO = `${API_URL}/user_infos`;
export const USERS = `${API_URL}/users`;
const requestHeader = { Authorization: token }

//User
export const fetchUserInfos = async () => {
    return await axios.get(`${USERS_INFO}`, { headers: requestHeader })
}

export const createInfo = async (body) => {
    return await axios.post(`${USERS_INFO}`, body, { headers: requestHeader });
}

export const fetchUser = async () => {
    return await axios.get(`${USERS}`, { headers: requestHeader })
}

export const createUser = async (body) => {
    return await axios.post(`${USERS}`, body, { headers: requestHeader });
}

export const deleteUser = async (body) => {
    return await axios.delete(`${USERS}/${body.id}`, body, {
        headers: { Authorization: token },
    });
}
export const editUser = async (body) => {
    return await axios.put(`${USERS}/${body.id}`, body, { headers: requestHeader });
}