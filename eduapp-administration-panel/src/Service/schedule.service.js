import axios from "axios";
import { API_URL, token } from '../API'
import { SUBJECTS } from "./subject.service";
export const EVENTS = `${API_URL}/calendar_annotations`
const requestHeader = { Authorization: token }

export const fetchSchedules = async () => {
    const endpoint = `${SUBJECTS}`

}
const FetchEvents = async () => {
    let payload = [];
    let request = await axios.get(EVENTS);
    request.data.map((e) => {
        let id = e.id;
        let title = e.annotation_title;
        let description = e.annotation_description;
        let start = e.annotation_start_date;
        let end = e.annotation_end_date;
        let isGlobal = e.isGlobal;
        let subject = e.subject_id;
        let subject_name = e.subject.name;
        let user = localStorage.userId;
        let dayStart = start.split("T")[0];
        let hourStart = start.split("T")[1];
        let dayEnd = end.split("T")[0];
        let hourEnd = end.split("T")[1];
        payload.push({
            id,
            title,
            description,
            dayStart,
            hourStart,
            dayEnd,
            hourEnd,
            isGlobal,
            subject,
            subject_name,
            user,
        });
        return true;
    });
    return payload
};
