import axios from "axios";
import { API_URL, token } from '../API'
export const CHAT_MESSAGES = `${API_URL}/chat_messages`;
export const CHAT = `${API_URL}/chat_bases`;
export const CHAT_PARTICIPANT = `${API_URL}/chat_participants`

const requestHeader = { Authorization: token }

//chat
export const fetchChat = async () => {
    let chats = []
    await axios.get(`${CHAT}`, { headers: requestHeader }).then((res) => {
        res.data.map((chat) => {
            return chats.push(chat)
        })
    })
    return chats;
}
export const deleteChat = async (id) => {
    return await axios.delete(`${CHAT}/${id}`, {
        headers: requestHeader,
    });
}
export const createChat = async (data) => {
    return await axios.post(`${CHAT}`, data, { headers: requestHeader })
}

export const editChat = async (data) => {
    return await axios.put(`${CHAT}/${data.id}`, data, { headers: requestHeader })
}

//chat Participant
export const fetchChatParticipants = async () => {
    let participant = []
    await axios.get(`${CHAT_PARTICIPANT}`, { headers: requestHeader }).then((res) => {
        res.data.map((chat) => {
            return participant.push(chat)
        })
    })
    return participant
}

export const deleteParticipant = async (id) => {
    return await axios.delete(`${CHAT_PARTICIPANT}/${id}`, { headers: requestHeader });
}

export const createParticipant = async (data) => {
    return await axios.post(`${CHAT_PARTICIPANT}`, data, { headers: requestHeader })
}

//Message 
export const fetchMessage = async () => {
    let message = []
    await axios.get(`${CHAT_MESSAGES}`, { headers: requestHeader }).then((res) => {
        res.data.map((sms) => {
            return message.push(sms)
        })
    })
    return message
}

export const deleteMessage = async (id) => {
    return await axios.delete(`${CHAT_MESSAGES}/${id}`, { headers: requestHeader });
}

export const createMessage = async (data) => {
    return await axios.post(`${CHAT_MESSAGES}`, data, { headers: requestHeader })
}

