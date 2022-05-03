import React, { useState, useEffect } from "react";
import ACManager from "../../utils/websockets/actioncable/ACManager";
import Loader from "../../components/loader/Loader";
import StandardModal from "../../components/modals/standard-modal/StandardModal";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import * as CHAT_SERVICE from "../../services/chat.service";
import "./ChatMenu.css";

let acManager = new ACManager();
export default function ChatMenu() {
  const [chats, setChats] = useState([]);
  const [canCreate, setCanCreate] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  let userInfo = FetchUserInfo(localStorage.userId);

  const getChats = async () => {
    let chats = await CHAT_SERVICE.fetchPersonalChats(localStorage.userId);
    console.log(chats.data);
    setChats(chats.data);
  };

  useEffect(() => {
    acManager.closeConnection();
    getChats();
  }, []);

  useEffect(() => {
    if (userInfo.teaching_list !== undefined) {
      if (userInfo.isAdmin || userInfo.teaching_list.length > 0)
        setCanCreate(true);
    }
  }, [userInfo]);

  return (
    <>
      <div id="chat-loader">
        <Loader />
      </div>
      <StandardModal
        show={showPopup}
        type={"info"}
        text={"What type of chat do you wish to create?"}
        isQuestion
        hasCancel
        hasTransition
        hasIconAnimation
        customYes={"Direct"}
        customNo={"Group"}
        onYesAction={() => {
          window.location.href = "/chat/create/direct";
        }}
        onNoAction={() => {
          window.location.href = "/chat/create/group";
        }}
        onCancelAction={() => {
          setShowPopup(false);
        }}
      />
      <div className="chat-menu-container">
        <div className="chat-search-container">
          <form action="">
            <input type="text" />
            <div className="chat-search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="32"
                height="32"
                viewBox="0 0 32 32"
              >
                <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z"></path>
              </svg>
            </div>
          </form>
        </div>

        <div className="chats-container">
          {chats.length !== 0 ? (
            <>
              <h2>Chats</h2>
              <ul>
                {chats.map((chat) => {
                  let connectionId =
                    (chat.chat_base.isGroup ? "g" : "p") + chat.chat_base.id;
                  return (
                    <li
                      key={chat.chat_base.id}
                      onClick={() => {
                        window.location.href = `/chat/${connectionId}`;
                      }}
                      id={connectionId}
                    >
                      <img
                        className="chat-icon"
                        src={
                          chat.chat_base.image !== undefined
                            ? chat.chat_base.image
                            : chat.chat_base.isGroup
                            ? "https://d22r54gnmuhwmk.cloudfront.net/rendr-fe/img/default-organization-logo-6aecc771.gif"
                            : "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                        }
                        alt="Chat User Icon"
                      />
                      <div className="chat-info chat-idle-state">
                        <h2 className="chat-name">
                          {chat.chat_base.chat_name}
                        </h2>
                        {/* <p className="chat-writing">Equisde is writing...</p> */}
                      </div>
                      {/* <p className="chat-pending-messages">
                        <span>20</span>
                      </p> */}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
          <div
            className="chat-add-button"
            style={{ display: canCreate ? "flex" : "none" }}
            onClick={() => {
              setShowPopup(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              className="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
