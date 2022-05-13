import axios from "axios";
import { API_URL, TOKEN } from "../API";
export const CHAT_MESSAGES = `${API_URL}/chat_messages`;
export const CHAT = `${API_URL}/chat_bases`;
export const CHAT_PARTICIPANT = `${API_URL}/chat_participants`;

const requestHeader = { eduauth: TOKEN };

//chat
export const fetchChat = async () => {
  return await axios.get(`${CHAT}`, { headers: requestHeader });
};
export const deleteChat = async (id) => {
  return await axios.delete(`${CHAT}/${id}`, {
    headers: requestHeader,
  });
};
export const createChat = async (data) => {
  return await axios.post(`${CHAT}`, data, { headers: requestHeader });
};

export const editChat = async (data) => {
  return await axios.put(`${CHAT}/${data.id}`, data, {
    headers: requestHeader,
  });
};

//chat Participant
export const fetchChatParticipants = async () => {
  return await axios.get(`${CHAT_PARTICIPANT}`, { headers: requestHeader });
};

export const deleteParticipant = async (id) => {
  return await axios.delete(`${CHAT_PARTICIPANT}/${id}`, {
    headers: requestHeader,
  });
};

export const createParticipant = async (data) => {
  return await axios.post(`${CHAT_PARTICIPANT}`, data, {
    headers: requestHeader,
  });
};

export const createCompleteChat = async (chat_info) => {
  let chat_base = await createChat(chat_info.base);

  let hasBeenAdmin = false;
  for (let u of chat_info.participants.user_ids) {
    await createParticipant({
      chat_base_id: chat_base.data.id,
      user_id: u,
      isChatAdmin: hasBeenAdmin ? false : true,
    });
    hasBeenAdmin = true;
  }

  return chat_base.data.id;
};

//Message
export const fetchMessage = async () => {
  return await axios.get(`${CHAT_MESSAGES}`, { headers: requestHeader });
};

export const deleteMessage = async (id) => {
  return await axios.delete(`${CHAT_MESSAGES}/${id}`, {
    headers: requestHeader,
  });
};

export const createMessage = async (data) => {
  return await axios.post(`${CHAT_MESSAGES}`, data, { headers: requestHeader });
};
