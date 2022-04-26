import axios from "axios";
import { API_URL, token } from '../API'
export const CHAT_MESSAGES = `${API_URL}/chat_messages`;
export const CHAT = `${API_URL}/chat_bases`;
export const CHAT_PARTICIPANT = `${API_URL}/chat_participants`

const requestHeader = { Authorization: token }

//chat
export const fetchChat = async () => {
    const endpoint = `${CHAT}`
    let chats = []
    await axios.get(endpoint, { headers: requestHeader }).then((res) => {
        res.data.map((chat) => {
            return chats.push(chat)
        })
    })
    return chats;
}
export const deleteChat = async (id) => {
    const endpoint = `${CHAT}/${id}`;
    return await axios.delete(endpoint, {
        headers: requestHeader,
    });
}
export const createChat = async (data) => {
    const endpoint = `${CHAT}`
    await axios.post(endpoint, data, { headers: requestHeader })
}

//chat Participant
export const fetchChatParticipants = async () => {
    let participant = []
    const endpoint = `${CHAT_PARTICIPANT}`
    await axios.get(endpoint, { headers: requestHeader }).then((res) => {
        res.data.map((chat) => {
            return participant.push(chat)
        })
    })
    return participant
}

export const deleteParticipant = async (id) => {
    const endpoint = `${CHAT_PARTICIPANT}/${id}`;
    return await axios.delete(endpoint, { headers: requestHeader });
}

export const createParticipant = async (data) => {
    const endpoint = `${CHAT_PARTICIPANT}`
    return await axios.post(endpoint, data, { headers: requestHeader })
}

//Message 
export const fetchMessage = async () => {
    let message = []
    const endpoint = `${CHAT_MESSAGES}`
    await axios.get(endpoint, { headers: requestHeader }).then((res) => {
        res.data.map((sms) => {
            return message.push(sms)
        })
    })
    return message
}

export const deleteMessage = async (id) => {
    const endpoint = `${CHAT_MESSAGES}/${id}`;
    return await axios.delete(endpoint, { headers: requestHeader });
}

export const createMessage = async (data) => {
    const endpoint = `${CHAT_MESSAGES}`
    return await axios.post(endpoint, data, { headers: requestHeader })
}

