import React, { useState, useEffect } from "react";
import AppHeader from "../../../components/appHeader/AppHeader";
import { asynchronizeRequest } from "../../../API.js";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import { getOfflineUser } from "../../../utils/OfflineManager";
import * as CHAT_SERVICE from "../../../services/chat.service";
import * as USER_SERVICE from "../../../services/user.service";
import "./DirectChatCreate.css";
import useViewsPermissions from "../../../hooks/useViewsPermissions";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";

export default function DirectChatCreate() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [participant, setParticipant] = useState(null);
  const [createButton, setCreateButton] = useState("Create");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const matchUsers = (nameInput) => {
    if (nameInput.length > 0) {
      asynchronizeRequest(async () => {
        let match = await USER_SERVICE.findByName(nameInput);

        let filteredUsers = [];
        for (let u of match.data) {
          if (u.user.id === parseInt(getOfflineUser().user.id)) continue;
          if (participant !== null) {
            if (u.user.id === participant.user.id) continue;
          }

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
    if (createButton === "Create") {
      setCreateButton("Creating...");
      asynchronizeRequest(async () => {
        try {
          let connectionId = await CHAT_SERVICE.createCompleteChat({
            base: {
              chat_name: `private_chat_${getOfflineUser().user.id}_${
                participant.user.id
              }`,
              isGroup: false,
            },
            participants: {
              user_ids: [getOfflineUser().user.id, participant.user.id],
            },
          });
          window.location.href = "/chat/p" + connectionId;
        } catch (err) {
          setPopupMessage("Chat already exists!");
          setCreateButton("Create");
          setShowPopup(true);
        }
      }).then((err) => {
        if (err) {
          setPopupMessage("An error ocurred while creating the chat.");
          setShowPopup(true);
          setCreateButton("Create");
        }
      });
    }
  };

  useViewsPermissions(FetchUserInfo(getOfflineUser().user.id), "chat");
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
        tabName="Create Direct Chat"
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
          <h2>Search Users</h2>
          <input
            type="text"
            className="user-search"
            value={userQuery}
            onChange={(e) => {
              setUserQuery(e.target.value);
            }}
            placeholder="Search by Name"
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
                <h2>Chat Preview</h2>
                <li
                  onClick={() => {
                    window.location.href = `/chat/`;
                  }}
                  id={"p"}
                >
                  <img
                    className="chat-icon"
                    src={
                      participant.profile_image !== undefined &&
                      participant.profile_image !== null
                        ? participant.profile_image
                        : "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                    }
                    alt="Chat User Icon"
                  />
                  <div className="chat-info chat-writing-state">
                    <h2 className="chat-name">{participant.user_name}</h2>
                    <p className="chat-writing">Nice to meet you!</p>
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
