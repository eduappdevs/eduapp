/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../../components/appHeader/AppHeader";
import { asynchronizeRequest } from "../../../API.js";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import { getOfflineUser } from "../../../utils/OfflineManager";
import * as CHAT_SERVICE from "../../../services/chat.service";
import * as USER_SERVICE from "../../../services/user.service";
import useViewsPermissions from "../../../hooks/useViewsPermissions";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import userCan, { CHAT, CREATE } from "../../../hooks/userCan";
import useLanguage from "../../../hooks/useLanguage";
import getPrefixedImageURL from "../../../utils/UrlImagePrefixer";

import "./DirectChatCreate.css";

export default function DirectChatCreate() {
  const navigate = useNavigate();
  const language = useLanguage();

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [participant, setParticipant] = useState(null);
  const [createButton, setCreateButton] = useState(language.create);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  let userInfo = FetchUserInfo(getOfflineUser().user.id);

  let canCreate = userCan(userInfo, CHAT, CREATE);

  const matchUsers = (nameInput) => {
    if (nameInput.length > 0) {
      asynchronizeRequest(async () => {
        let match = await USER_SERVICE.findByName(nameInput);

        let filteredUsers = [];
        for (let u of match.data) {
          if (u.user.id === getOfflineUser().user.id) continue;
          if (participant !== null)
            if (u.user.id === participant.user.id) continue;

          filteredUsers.push(u);
        }

        setSuggestedUsers(filteredUsers);
      }).then((err) => {
        if (err) console.log("error");
      });
    } else {
      setSuggestedUsers([]);
    }
  };

  const createChat = () => {
    if (createButton === language.create) {
      setCreateButton(language.creating);
      asynchronizeRequest(async () => {
        try {
          let connectionId = await CHAT_SERVICE.createCompleteChat({
            base: {
              chat_name: `private_chat_${getOfflineUser().user.id}_${participant.user.id
                }`,
              isGroup: false,
            },
            participants: {
              user_ids: [getOfflineUser().user.id, participant.user.id],
            },
          });
          navigate("/chat/p" + connectionId);
        } catch (err) {
          setPopupMessage(language.chat_exists);
          setCreateButton(language.create);
          setShowPopup(true);
        }
      }).then((err) => {
        if (err) {
          setPopupMessage(language.chat_create_unknown);
          setShowPopup(true);
          setCreateButton(language.create);
        }
      });
    }
  };

  useViewsPermissions(FetchUserInfo(getOfflineUser().user.id), "chat");

  useEffect(() => {
    if (canCreate !== null) {
      if (!canCreate) window.location.href = "/chat";
      setCreateButton(language.create);
    }
  }, [canCreate]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => matchUsers(userQuery), 500);
    return () => clearTimeout(searchTimeout);
  }, [userQuery]);

  return (
    <>
      <AppHeader
        closeHandler={() => {
          window.location.href = "/chat";
        }}
        tabName={language.chat_title_direct}
      />

      <div className="direct-chat-container">
        <StandardModal
          show={showPopup}
          text={popupMessage}
          type={"error"}
          hasIconAnimation
          hasTransition
          onCloseAction={() => setShowPopup(false)}
        />
        <div className="user-search-bar">
          <h2>{language.chat_search_users}</h2>
          <input
            type="text"
            className="user-search"
            value={userQuery}
            onChange={(e) => {
              setUserQuery(e.target.value);
            }}
            placeholder={language.chat_search_names}
          />
          {suggestedUsers.length > 0 && (
            <ul className="suggested-users">
              {suggestedUsers.map((u) => {
                return (
                  <li
                    key={u.id}
                    onClick={() => {
                      setParticipant(u);
                      setSuggestedUsers([]);
                      setUserQuery("");
                    }}
                  >
                    {u.user_name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {participant && (
          <>
            <div className="chats-container direct-chat-preview">
              <ul>
                <h2>{language.chat_preview}</h2>
                <li
                  onClick={() => {
                    createChat()
                  }}
                  id={"p"}
                >
                  <img
                    className="chat-icon"
                    src={
                      participant.profile_image?.url
                        ? getPrefixedImageURL(participant.profile_image.url)
                        : "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                    }
                    alt="Chat User Icon"
                  />
                  <div className="chat-info chat-writing-state">
                    <h2 className="chat-name">{participant.user_name}</h2>
                    <p className="chat-writing">{language.chat_welcome}</p>
                  </div>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="chat-create"
              onClick={() => {
                createChat();
              }}
            >
              {createButton}
            </button>
          </>
        )}
      </div>
    </>
  );
}
