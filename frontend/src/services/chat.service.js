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

export const fetchChatInfo = async (id) => {
  return await axios.get(`${CHAT}?complete_chat_for=${id}`, {
    headers: requestHeader,
  });
};

export const findChatById = async (id) => {
  return await axios.get(`${CHAT}/${id}`, { headers: requestHeader });
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
export const setChatRead = async (data) => {
  return await axios.put(`${CHAT}/${data.id}/read`, data, {
    headers: requestHeader,
  });
};

//chat Participant
export const fetchChatParticipants = async () => {
  return await axios.get(`${CHAT_PARTICIPANT}`, { headers: requestHeader });
};

export const fetchChatUsers = async (cId) => {
  return await axios.get(`${CHAT_PARTICIPANT}?chat_id=${cId}`, {
    headers: requestHeader,
  });
};

export const removeParticipant = async (uId, cId) => {
  return await axios.delete(`${CHAT_PARTICIPANT}/remove/${uId}/${cId}`, {
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

export const fetchPersonalChats = async (userId) => {
  return await axios.get(CHAT_PARTICIPANT + "?chats_for=" + userId, {
    headers: requestHeader,
  });
};

//Message
export const fetchChatMessages = async (cId, startingDate = null) => {
  let startingDateWithoutTimeZone = startingDate ? startingDate.split("+")[0] : ""; //AD HOC. REMOVE +1:00. SHOULD BE BETTER SOLVED
  // startingDateWithoutTimeZone = startingDate ? startingDateWithoutTimeZone.split("-")[0] : ""; //DOESN'T WORK BECAUSE DATE HAS 2023-06-23. OTHER SOLUTION MUST BE FOUND.

  const auxStartingDate = startingDate ? `&send_date=${startingDateWithoutTimeZone}` : "";
  // const encodedURL = encodeURI(`${CHAT_MESSAGES}?chat_base_id=${cId}${auxStartingDate}`);
  // console.log(encodedURL);
  return await axios.get(`${CHAT_MESSAGES}?chat_base_id=${cId}${auxStartingDate}`, { headers: requestHeader });
};

export const deleteMessage = async (id) => {
  return await axios.delete(`${CHAT_MESSAGES}/${id}`, {
    headers: requestHeader,
  });
};

export const createMessage = async (data) => {
  return await axios.post(`${CHAT_MESSAGES}`, data, { headers: requestHeader });
};
