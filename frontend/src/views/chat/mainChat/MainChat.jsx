import React, { useState, useEffect } from "react";
import DarkModeChanger from "../../../components/DarkModeChanger";
import ChatBubble from "./chatBubbles/ChatBubble";
import AppHeader from "../../../components/appHeader/AppHeader";
import "./MainChat.css";

export default function MainChat(props) {
  const [isMobile, setIsMobile] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const acInstance = props.ActionCableManager;

  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }, 4000);
  };

  const sendMessage = () => {
    let inputMsg = document.getElementById("message-area");
    acInstance.sendChannelCmd(
      "message",
      inputMsg.value,
      localStorage.userId,
      new Date().toISOString()
    );
    inputMsg.value = "";
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
    checkMediaQueries();
    DarkModeChanger(localStorage.getItem("darkMode"));

    document.addEventListener("new_msg", (e) => {
      e.stopImmediatePropagation();
      manageIncomingMsg(e.detail);
    });

    if (window.matchMedia("(max-width: 900px)").matches) {
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
          chatName={props.chatName}
          closeHandler={() => {
            props.closeHandler();
          }}
        />

        <div className="main-chat-messages-container">
          {props.messages.length !== 0
            ? props.messages.map((msg) => {
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
              class="bi bi-paperclip"
              viewBox="0 0 16 16"
            >
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
            </svg>
          </div>
          <div className="main-chat-input-text">
            <textarea id="message-area" />
          </div>
          <div className="main-chat-send-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-send"
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
