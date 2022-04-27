import axios from "axios";
import { API_URL, token } from '../API'
export const INSTITUTIONS = `${API_URL}/institutions`;
const requestHeader = { Authorization: token }

//Institutions
export const fetchInstitutions = async () => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.get(endpoint).then({ headers: requestHeader });
}

export const fetchInstitution = async (id) => {
    const endpoint = `${INSTITUTIONS}/${id}`;
    return await axios.get(endpoint).then({ headers: requestHeader });
}

export const createInstitution = async (body) => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.post(endpoint, body).then({ headers: requestHeader });
}

export const deleteInstitution = async (id) => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.delete(endpoint + `/${id}`, {
        headers: requestHeader,
    });
}

export const editInstitution = async (body) => {
    const endpoint = `${INSTITUTIONS}`;
    return await axios.put(`${endpoint}/${body.id}`, body).then({ headers: requestHeader });
}