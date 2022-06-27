import axios from "axios";
import { API_URL, TOKEN } from "../API";
const requestHeader = { eduauth: TOKEN };

export const getExtraFields = async (data) => {
    let url = `${API_URL}/extrafields/${data.table}/${data.id}`
    return await axios.get(url, {
        headers: requestHeader,
    });
}

export const pushExtraFields = async (data,body) => {
    let url = `${API_URL}/extrafields/${data.table}/${data.id}`
    return await axios.post(url, body, {
        headers: requestHeader,
    });
}

export const deleteExtraFields = async (data) => {
    let url = `${API_URL}/extrafields/${data.table}/${data.id}/${data.name}`
    return await axios.delete(url, {
        headers: requestHeader,
    });
}

export const updateExtraFields = async (data,body) => {
    let url = `${API_URL}/extrafields/${data.table}/${data.id}`
    console.log(body);
    return await axios.put(url, body, {
        headers: requestHeader,
    });
}
