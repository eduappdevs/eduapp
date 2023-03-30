/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { asynchronizeRequest } from "../../../../API";
import AppHeader from "../../../../components/appHeader/AppHeader";
import StandardModal from "../../../../components/modals/standard-modal/StandardModal";
import { IMG_FLBK_GROUP, IMG_FLBK_USER } from "../../../../config";
import { MainChatInfoCtx } from "../../../../hooks/MainChatInfoContext";
import useLanguage from "../../../../hooks/useLanguage";
import * as CHAT_SERVICE from "../../../../services/chat.service";
import {
  getOfflineUser,
  interceptExpiredToken,
} from "../../../../utils/OfflineManager";
import "../../createGroupChat/GroupChatCreate.css";

export default function MainChatInfo() {
  // eslint-disable-next-line no-unused-vars
  const [cInfoCtx, _] = useContext(MainChatInfoCtx);
  const [chat, setChat] = useState(null);
  const [filteredParticipants, setFilteredParticipants] = useState(null);
  const language = useLanguage();

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [iconType, setIconType] = useState("warning");
  const [isPopupQuestion, setIsPopupQuestion] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [removeParticipant, setRemoveParticipant] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isGroup = () => {
    return chat.chat.isGroup;
  };

  const fillName = (phrase, name) => {
    return phrase.replace("%1s", name);
  };

  const showLeaveChatDialog = () => {
    setIconType("warning");
    setPopupText(language.chat_want_leave);
    setIsPopupQuestion(true);
    setIsLeave(true);
    setShowPopup(true);
  };

  const confirmRemoveDialog = (participant) => {
    setIconType("warning");
    setPopupText(fillName(language.chat_want_remove, participant.user_name));
    setIsPopupQuestion(true);
    setIsLeave(false);
    setShowPopup(true);
  };

  const showRemoveSuccessDialog = () => {
    setIconType("info");
    setPopupText(fillName(language.chat_removed, removeParticipant.user_name));
    setIsPopupQuestion(false);
    setShowPopup(true);
    setRemoveParticipant(null);
  };

  const filterWithQuery = (query) => {
    let fp = [];
    for (let p of chat.participants)
      if (p.user_name.includes(query)) fp.push(p);

    setFilteredParticipants(fp);
  };

  const leaveChat = async () => {
    asynchronizeRequest(async () => {
      try {
        await CHAT_SERVICE.removeParticipant(
          getOfflineUser().user.id,
          chat.chat.id
        );
        window.location.href = "/chat";
      } catch (err) {
        await interceptExpiredToken(err);
      }
    }).then((err) => {
      if (err) console.log("connection error");
    });
  };

  const removeMember = async () => {
    asynchronizeRequest(async () => {
      try {
        await CHAT_SERVICE.removeParticipant(
          removeParticipant.user.id,
          chat.chat.id
        );

        let c = { ...chat };
        c.participants.splice(
          c.participants.indexOf(
            c.participants.find((u) => u.user.id === removeParticipant.user.id)
          ),
          1
        );
        setChat(c);
        setFilteredParticipants(c.participants);
        setTimeout(() => showRemoveSuccessDialog(), 100);
      } catch (err) {
        await interceptExpiredToken(err);
      }
    }).then((err) => {
      if (err) console.log("connection error");
    });
  };

  const fixPrivateChats = (info) => {
    if (info.chat.chat_name.includes("private_chat_")) {
      let participant = info.participants.find(
        (u) => u.user.id !== getOfflineUser().user.id
      );
      info.chat.image =
        participant.profile_image !== null
          ? participant.profile_image
          : undefined;
      info.chat.chat_name = participant.user_name;
    }

    return info;
  };

  const handleEmptyContext = async () => {
    const requestedId = window.location.pathname.split("/")[3].substring(1);

    if (cInfoCtx === null || requestedId !== cInfoCtx.chatInfo.id) {
      asynchronizeRequest(async () => {
        setChat(
          fixPrivateChats((await CHAT_SERVICE.fetchChatInfo(requestedId)).data)
        );
      }).then((err) => {
        if (err) console.log("no connection");
      });
    } else {
      if (cInfoCtx.chatParticipants.length === undefined) {
        let me = getOfflineUser();
        cInfoCtx.chatParticipants = [
          cInfoCtx.chatParticipants,
          {
            user_name: me.user_name,
            profile_image: me.profile_image,
            user: me.user,
          },
        ];
      }

      setChat(
        fixPrivateChats({
          chat: cInfoCtx.chatInfo,
          participants: cInfoCtx.chatParticipants,
        })
      );
    }

    setTimeout(() => window.dispatchEvent(new Event("canLoadChat")), 100);
  };

  const changeGroupName = async () => {
    if (chat.chat.chat_name !== "") await CHAT_SERVICE.editChat(chat.chat);
  };

  useEffect(() => handleEmptyContext(), []);

  useEffect(() => {
    if (chat !== null)
      setIsAdmin(
        chat.participants.find((u) => u.user.id === getOfflineUser().user.id)
          .isChatAdmin
      );

    if (isEditingName) {
      const searchTimeout = setTimeout(
        async () => await changeGroupName(),
        600
      );
      return () => clearTimeout(searchTimeout);
    }
  }, [chat]);

  return (
    <>
      <AppHeader
        tabName={language.chat_information}
        closeHandler={() =>
          (window.location.href =
            "/chat/" + window.location.pathname.split("/")[3])
        }
      />
      {chat !== null ? (
        <div className="chat-create-container">
          <StandardModal
            show={showPopup}
            type={iconType}
            text={popupText}
            onYesAction={async () => {
              if (isLeave) await leaveChat();
              else await removeMember();
              setShowPopup(false);
            }}
            onNoAction={() => setShowPopup(false)}
            onCloseAction={() => {
              setShowPopup(false);
            }}
            isQuestion={isPopupQuestion}
            hasTransition
            hasIconAnimation
          />
          <div className="group-chat-img" style={{ marginBottom: "20px" }}>
            <img
              src={isGroup() ? IMG_FLBK_GROUP : IMG_FLBK_USER}
              alt={"group chat"}
              id="profileImage_preview"
              onClick={() =>
                isGroup()
                  ? document.getElementById("profileImage_upload").click()
                  : null
              }
            />
            {isGroup() && (
              <input
                type="file"
                name="profile_image"
                id="profileImage_upload"
              />
            )}
          </div>
          <div className="group-name-input">
            <input
              type="text"
              value={chat.chat.chat_name}
              disabled={!isGroup()}
              onChange={(e) => {
                if (isGroup()) {
                  setIsEditingName(true);
                  let c = { ...chat };
                  c.chat.chat_name = e.target.value;
                  setChat(c);
                }
              }}
              style={
                isGroup()
                  ? { fontSize: "1.5rem" }
                  : { border: "none", boxShadow: "none", fontSize: "1.5rem" }
              }
              maxLength={25}
            />
          </div>
          {isGroup() ? (
            <div className="group-participants">
              <div className="user-search-bar">
                <h2>{language.chat_participants}</h2>
                <input
                  type="text"
                  className="user-search"
                  onChange={(e) => filterWithQuery(e.target.value)}
                  placeholder={language.chat_search_names}
                />
              </div>
              <div className="participant-table">
                <table>
                  <tbody>
                    {chat.participants.length > 0 ? (
                      chat.participants.map((p) => {
                        if (filteredParticipants !== null)
                          if (!filteredParticipants.includes(p)) return <></>;
                        return (
                          <tr key={p.id}>
                            <td className="chat-is-admin">
                              <img
                                src={
                                  p.profile_image !== null
                                    ? p.profile_image
                                    : IMG_FLBK_USER
                                }
                                alt={"participant profile"}
                              />
                              {p.isChatAdmin && <span>ADMIN</span>}
                            </td>
                            <td>{p.user_name}</td>
                            {isAdmin ? (
                              <td>
                                {p.user.id !== getOfflineUser().user.id ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-trash"
                                    viewBox="0 0 16 16"
                                    onClick={() => {
                                      setRemoveParticipant(p);
                                      confirmRemoveDialog(p);
                                    }}
                                  >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                    />
                                  </svg>
                                ) : null}
                              </td>
                            ) : (
                              <td></td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td>
                          <img src={IMG_FLBK_USER} alt={"chat profile"} />
                        </td>
                        <td>{language.chat_no_participants}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            className="chat-create"
            onClick={() => showLeaveChatDialog()}
          >
            Leave
          </button>
        </div>
      ) : null}
    </>
  );
}
