import axios from "axios";
import { API_URL, token } from "../API";
export const RESOURCE = `${API_URL}/resources`;

const requestHeader = { Authorization: token };

export const fetchResources = async () => {
    return await axios.get(RESOURCE, { headers: requestHeader });
};

export const createResources = async (body) => {
    return await axios.post(RESOURCE, body, { headers: requestHeader });
};

export const editResources = async (body) => {
    return await axios.put(`${RESOURCE}/${body.id}`, body, { headers: requestHeader });
};

export const deleteResources = async (body) => {
    return await axios.delete(`${RESOURCE}/${body.id}`, { headers: requestHeader });
};

export const fetchResourcesJson = async () => {
    return await (await fetch(RESOURCE)).json();
};
