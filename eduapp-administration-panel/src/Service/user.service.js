import axios from "axios";
import { API_URL, token } from '../API'
export const USERS_INFO = `${API_URL}/user_infos`;
export const USERS = `${API_URL}/users`;
const requestHeader = { Authorization: token }

//User
export const fetchUserInfos = async () => {
    const endpoint = `${USERS_INFO}`;
    let userInfo = []
    await axios.get(endpoint, { headers: requestHeader }).then((res) => {
        res.data.map((result) => {
            userInfo.push(result)
            return true
        })
    });
    return userInfo;
}

export const createInfo = async (body) => {
    const endpoint = `${USERS_INFO}`;
    return await axios.post(endpoint, body, { headers: requestHeader });
}

export const createUser = async (body) => {
    const endpoint = `${USERS}`;
    return await axios.post(endpoint, body, { headers: requestHeader });
}

export const deleteUser = async (body) => {
    const endpoint = `${USERS}`;
    return await axios.delete(endpoint, body, {
        headers: { Authorization: token },
    });
}
export const editUser = async (body) => {
    const endpoint = `${USERS}`;
    return await axios.put(endpoint, body, { headers: requestHeader });
}