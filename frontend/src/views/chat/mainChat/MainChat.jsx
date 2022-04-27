import React, { useState, useEffect } from "react";
import ChatBubble from "./chatBubbles/ChatBubble";
import AppHeader from "../../../components/appHeader/AppHeader";
import ACManager from "../../../utils/websockets/actioncable/ACManager";
import { asynchronizeRequest } from "../../../API";
import axios from "axios";
import { CHAT_BASE, CHAT_MESSAGES, CHAT_PARTICIPANTS } from "../../../config";
import "./MainChat.css";

const acInstance = new ACManager();
export default function MainChat() {
  const [isMobile, setIsMobile] = useState(false);
  const [chat, setChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);

  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.innerWidth > 1000) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }, 4000);
  };

  const sendMessage = () => {
    let inputMsg = document.getElementById("message-area");
    if (
      inputMsg.value !== "" &&
      inputMsg.value !== " " &&
      inputMsg.value.length > 0
    ) {
      acInstance.sendChannelCmd(
        "message",
        inputMsg.value,
        localStorage.userId,
        new Date().toISOString()
      );
      inputMsg.value = "";
    }
  };

  const manageIncomingMsg = (newMsg) => {
    if (
      newMsg.chat_base.id ===
      parseInt(acInstance.chatCode[acInstance.chatCode.length - 1])
    ) {
      setNewMessages((prevMsgs) => [...prevMsgs, newMsg]);
      let messageBox = document.getElementsByClassName(
        "main-chat-messages-container"
      )[0];
      if (messageBox.childNodes.length !== 0) {
        messageBox.childNodes[
          messageBox.childNodes.length - 1
        ].scrollIntoView();
      }
    }
  };

  useEffect(() => {
    acInstance.chatCode = window.location.pathname.split("/")[2];
    let chatId = acInstance.chatCode.substring(1);

    asynchronizeRequest(async function () {
      let cInfo = await axios.get(CHAT_BASE + "/" + chatId);

      let cPeople = await axios.get(CHAT_PARTICIPANTS + "?chat_id=" + chatId);

      chat.chatInfo = cInfo.data;
      chat.chatParticipants = cPeople.data;
    }).then(() => {
      acInstance.generateChannelConnection(acInstance.chatCode).then(() => {
        axios.get(CHAT_MESSAGES + "?chat_base_id=" + chatId).then((msgs) => {
          setMessages(msgs.data);
          setTimeout(() => {
            let messageBox = document.getElementsByClassName(
              "main-chat-messages-container"
            )[0];
            if (messageBox.childNodes.length !== 0) {
              messageBox.childNodes[
                messageBox.childNodes.length - 1
              ].scrollIntoView(true);
            }
            window.dispatchEvent(new Event("canLoadChat"));
          }, 100);
        });
      });
    });
  }, []);

  useEffect(() => {
    checkMediaQueries();
  }, [window.innerWidth]);

  useEffect(() => {
    document.addEventListener("new_msg", (e) => {
      e.stopImmediatePropagation();
      manageIncomingMsg(e.detail);
    });

    let inputArea = document.getElementById("message-area");
    inputArea.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (inputArea.value.length !== 0) sendMessage();
      }
    });

    if (window.innerWidth > 1000) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [newMessages, acInstance]);

  return (
    <>
      <div className="main-chat-container">
        <AppHeader
          type="main-chat"
          chatName={chat.chatInfo ? chat.chatInfo.chat_name : ""}
          closeHandler={() => {
						acInstance.closeConnection();
            window.location.href = "/chat";
          }}
        />

        <div className="main-chat-messages-container">
          {messages.length !== 0
            ? messages.map((msg) => {
                return (
                  <ChatBubble
                    key={msg.user.id + "-" + msg.id}
                    message={msg.message}
                    // eslint-disable-next-line eqeqeq
                    foreign={msg.user.id != localStorage.userId ? true : false}
                    isGroup={msg.chat_base.isGroup}
                    author={msg.user.email}
                    isMsgRecent={false}
                  />
                );
              })
            : null}
          {newMessages.length !== 0
            ? newMessages.map((msg) => {
                return (
                  <ChatBubble
                    key={msg.user.id + "-" + msg.id}
                    message={msg.message}
                    // eslint-disable-next-line eqeqeq
                    foreign={msg.user.id != localStorage.userId ? true : false}
                    isGroup={msg.chat_base.isGroup}
                    author={msg.user.email}
                    isMsgRecent={true}
                  />
                );
              })
            : null}
        </div>

        <div className="main-chat-input-container">
          <div className="main-chat-attachment-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="grey"
              className="bi bi-paperclip"
              viewBox="0 0 16 16"
              onClick={() => {
                alert("This option is under development.");
              }}
            >
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
            </svg>
          </div>
          <div className="main-chat-input-text">
            <textarea id="message-area" placeholder="EduApp W.I.P" />
          </div>
          <div className="main-chat-send-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send"
              viewBox="2 -5 15 23"
              onClick={sendMessage}
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
