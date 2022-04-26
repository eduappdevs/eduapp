import React, { useEffect, useState } from "react";
import * as CHATSERVICE from "../Service/chat.service";
import * as USERSERVICE from "../Service/user.service";

import * as API from "../API";

export default function ChatMessageConfig() {
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState([]);
  const [chat, setChat] = useState([]);
  const DISPLAY = false;

  const addMessage = async (e) => {
    swapIcons(true);

    e.preventDefault();
    const context = ["chat_base_id", "user_id", "message", "send_date"];
    let json = [];
    let chatBaseId = document.getElementById("chM_chat").value;
    let UserId = document.getElementById("chM_user").value;
    let message = document.getElementById("chM_message").value;
    let date = new Date();
    let sendDate = `${date.getDate()}-
    ${date.getFullYear()}-
    ${date.getDay()}T
    ${date.getHours()}:
    ${date.getMinutes()}:
    ${date.getSeconds()}`;
    console.log();
    let chatId = chatBaseId.split("_")[0];
    let userId = UserId.split("_")[0];
    if (userId !== "" && chatId !== "") {
      json.push(chatId, userId, message, sendDate);
    } else {
      console.log("error");
    }
    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      CHATSERVICE.createMessage(eventJson).then(() => {
        fetchMessage();
        swapIcons(false);
      });
    });
  };

  const fetchMessage = async () => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.fetchMessage().then((res) => {
        setMessage(res);
      });
    });
  };

  const fetchChat = async () => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.fetchChat().then((res) => {
        setChat(res);
      });
    });
  };

  const fetchUser = async () => {
    API.asynchronizeRequest(function () {
      USERSERVICE.fetchUserInfos().then((res) => {
        setUser(res);
      });
    });
  };

  const deleteMessage = async (id) => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.deleteMessage(id).then(() => {
        fetchMessage();
      });
    });
  };

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
      document.getElementById("ins-add-icon").style.display = "none";
    } else {
      document.getElementById("submit-loader").style.display = "none";
      document.getElementById("ins-add-icon").style.display = "block";
    }
  };
  const swapIconsDelete = (state, button, id) => {
    let deleteIcon = button.childNodes[0];
    let deleteLoader = button.childNodes[1];

    if (state) {
      if (button.tagName === "button") {
        deleteLoader.style.display = "block";
        deleteIcon.style.display = "none";
      } else {
        let buttonDelete = document.getElementById(id);
        let deleteIcon = buttonDelete.childNodes[0];
        let deleteLoader = buttonDelete.childNodes[1];
        deleteLoader.style.display = "block";
        deleteIcon.style.display = "none";
      }
    } else {
      deleteLoader.style.display = "none";
      deleteIcon.style.display = "block";
    }
  };

  useEffect(() => {
    fetchMessage();
    fetchUser();
    fetchChat();
  }, []);

  return (
    DISPLAY && (
      <>
        <div className="chatMessage-main-container">
          <table className="createTable">
            <thead>
              <tr>
                <th>ADD</th>
                <th>User</th>
                <th>Chat</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <button onClick={addMessage}>
                    <svg
                      xmlns="http://www.w3.org/2000/ svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-circle-fill"
                      viewBox="0 0 16 16"
                      id="ins-add-icon"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>
                    <div id="submit-loader" class="loader">
                      Loading...
                    </div>
                  </button>
                </td>
                <td>
                  <select name="chM_user" id="chM_user">
                    <option defaultValue="Choose user">Choose user</option>
                    {user.map((s) => (
                      <option
                        key={s.user_id}
                        value={s.user_id + "_" + s.user_name}
                      >
                        {s.user_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select name="chM_chat" id="chM_chat">
                    <option defaultValue="Choose Group">Choose Group</option>
                    {chat.map((s) => (
                      <option key={s.id} value={s.id + "_" + s.chat_name}>
                        {s.chat_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input type="text" name="chM_message" id="chM_message" />
                </td>
              </tr>
            </tbody>
          </table>
          {message && message.length !== 0 ? (
            <table className="eventList" style={{ marginTop: "50px" }}>
              <thead>
                <tr>
                  <th>Name Group</th>
                  <th>Group</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {message.map((e) => {
                  return (
                    <tr key={e.id}>
                      <td>{e.chat_base.chat_name}</td>
                      <td>{e.user.email}</td>
                      <td>{e.message}</td>
                      <td>{e.send_date}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => {
                            deleteMessage(e.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>
      </>
    )
  );
}
