import { useState, useEffect } from "react";
import ChatsAC from "../../utils/websockets/actioncable/ChatsAC";
import Loader from "../../components/loader/Loader";
import StandardModal from "../../components/modals/standard-modal/StandardModal";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import * as CHAT_SERVICE from "../../services/chat.service";
import { getOfflineUser } from "../../utils/OfflineManager";
import RequireAuth from "../../components/auth/RequireAuth";
import useViewsPermissions from "../../hooks/useViewsPermissions";
import userCan, {CHAT, CREATE}  from "../../hooks/userCan";
import useLanguage from "../../hooks/useLanguage";
import { IMG_FLBK_GROUP, IMG_FLBK_USER } from "../../config";
import "./ChatMenu.css";

let acManager = new ChatsAC();
export default function ChatMenu() {
  const [chats, setChats] = useState([]);

  const [showPopup, setShowPopup] = useState(false);

  const language = useLanguage();
  let userInfo = FetchUserInfo(getOfflineUser().user.id);
  let canCreate = userCan(userInfo, CHAT,CREATE);

  const getChats = async () => {
    let chats = (
      await CHAT_SERVICE.fetchPersonalChats(getOfflineUser().user.id)
    ).data.personal_chats;
    for (let c of chats) {
      if (c.chat_info.chat_name.includes("private_chat_")) {
        c.chat_info.image =
          c.chat_participant.profile_image !== null
            ? c.chat_participant.profile_image
            : undefined;
        c.chat_info.chat_name = c.chat_participant.user_name;
      }
    }
    setChats(chats);
  };

  useViewsPermissions(userInfo, "chat");
  useEffect(() => {
    acManager.closeConnection();
    RequireAuth();
    getChats();
  }, []);

  return (
    <>
      <div id="chat-loader">
        <Loader />
      </div>
      <StandardModal
        show={showPopup}
        type={"info"}
        text={language.chat_type_create}
        isQuestion
        hasCancel
        hasTransition
        hasIconAnimation
        customYes={language.chat_type_direct}
        customNo={language.chat_type_group}
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
              <h2>{language.chats}</h2>
              <ul>
                {chats.map((chat) => {
                  let connectionId =
                    (chat.chat_info.isGroup ? "g" : "p") + chat.chat_info.id;
                  return (
                    <li
                      key={chat.chat_info.id}
                      onClick={() => {
                        window.location.href = `/chat/${connectionId}`;
                      }}
                      id={connectionId}
                    >
                      <img
                        className="chat-icon"
                        src={
                          chat.chat_info.image !== undefined
                            ? chat.chat_info.image
                            : chat.chat_info.isGroup
                              ? IMG_FLBK_GROUP
                              : IMG_FLBK_USER
                        }
                        alt="Chat User Icon"
                      />
                      <div className="chat-info chat-idle-state">
                        <h2 className="chat-name">
                          {chat.chat_info.chat_name}
                        </h2>
                        {/* <p className="chat-writing">Equisde is writing...</p> */}
                      </div>
                      <p className="chat-pending-messages">
                        <span>{0}</span>
                      </p>
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
