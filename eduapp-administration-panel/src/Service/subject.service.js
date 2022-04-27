import axios from "axios";
import { API_URL, token } from '../API'
export const SUBJECTS = `${API_URL}/subjects`;
const requestHeader = { Authorization: token }

//subject
export const fetchSubjects = async () => {
    const endpoint = `${SUBJECTS}`;
    let subjects = [];
    await axios.get(endpoint, { headers: requestHeader }).then((res) => {
        res.data.map((subject) => {
            if (subject.name !== "Noticias") {
                return subjects.push(subject);
            }
            return true
        });
    });
    return subjects;
}

export const fetchSubject = async (id) => {
    const endpoint = `${SUBJECTS}?subject_id=${id}`;
    let subjects = [];
    await axios.get(endpoint, { headers: requestHeader }).then((res) => {
        res.data.map((subject) => {
            if (subject.name !== "Noticias") {
                return subjects.push(subject);
            }
            return true
        });
    });
    return subjects;
}

export const NoticiasSubject = async () => {
    const endpoint = `${SUBJECTS}/?name=Noticias`
    return await axios.get(endpoint)
}

export const createSubject = async (body) => {
    const endpoint = `${SUBJECTS}`;
    return await axios.post(endpoint, body)
}

export const deleteSubject = async (id) => {
    const endpoint = `${SUBJECTS}`
    return await axios.delete(`${endpoint}/${id}`)
}