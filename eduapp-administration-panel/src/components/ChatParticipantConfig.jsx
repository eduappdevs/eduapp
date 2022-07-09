/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState } from "react";
import * as CHATSERVICE from "../services/chat.service";
import * as USERSERVICE from "../services/user.service";
import * as API from "../API";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import PageSelect from "./pagination/PageSelect";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import useFilter from "../hooks/useFilter";
import { getParticipantFields } from "../constants/search_fields";
import "../styles/chatParticipant.css";

export default function ChatParticipantConfig() {
  const [language] = useContext(LanguageCtx);

  const [participant, setParticipant] = useState([]);
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState([]);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState();

  const [, setSearchParams] = useContext(SearchBarCtx);
  const filteredParticipants = useFilter(
    participant,
    null,
    CHATSERVICE.filterParticipants,
    getParticipantFields(language)
  );

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "100%";
      document.getElementById("standard-modal").style.height = "100%";
      document.getElementById("controlPanelContentContainer").style.overflow =
        "hidden";
    }
  };

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  };

  const finalizedCreate = (type, icon, txt, confirmDel) => {
    fetchParticipantsPage(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(txt);
  };

  const finalizedDelete = (type, icon, confirmDel, text) => {
    switchEditState(false);
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchParticipantsPage(actualPage);
  };

  const fetchParticipantsPage = async (page) => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.pagedChatParticipants(page)
        .then((res) => {
          setParticipant(res.data.current_page);
          setMaxPages(res.data.total_pages);
          setActualPage(res.data.page);
          fetchUser();
          fetchChat();
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchChat = async () => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.fetchChat()
        .then((res) => {
          setChat(res.data);
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchUser = async () => {
    API.asynchronizeRequest(function () {
      USERSERVICE.fetchUserInfos()
        .then((res) => {
          setUsers(res.data);
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const addParticipant = async (e) => {
    e.preventDefault();
    switchEditState(false);

    const context = ["chat_base_id", "user_id", "isChatAdmin"];
    let json = [];
    let chatBaseId = document.getElementById("chP_chat").value;
    let UserId = document.getElementById("chP_user").value;
    let isAdmin = document.getElementById("chP_isAdmin").checked;
    let chatId = chatBaseId.split("_")[0];
    let userId = UserId.split("_")[0];

    if (userId !== "Choose User" && chatId !== "") {
      json.push(chatId, userId, isAdmin);
    } else {
      finalizedCreate("error", true, language.creationFailed, false);
    }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      CHATSERVICE.createParticipant(eventJson)
        .then((x) => {
          if (x) {
            finalizedCreate("info", true, language.creationCompleted, false);
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedCreate("error", true, language.creationFailed, false);
            await interceptExpiredToken(e);
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const deleteParticipant = async (id) => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.deleteParticipant(id)
        .then((e) => {
          if (e) {
            finalizedDelete("info", true, false, language.deleteAlertCompleted);
          }
        })
        .catch(async (err) => {
          if (err) {
            finalizedDelete("error", true, false, language.deleteAlertFailed);
            await interceptExpiredToken(err);
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const confirmDeleteParticipant = async (id) => {
    switchEditState(false);
    finalizedDelete("warning", true, true, language.deleteAlert);
    setIdDelete(id);
  };

  useEffect(() => fetchParticipantsPage(1), []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getParticipantFields(language),
      selectedField: getParticipantFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th>{language.add}</th>
              <th>{language.user}</th>
              <th>{language.chat}</th>
              <th>{language.admin}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button onClick={addParticipant}>
                  <svg
                    id="add-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                  <svg
                    id="commit-loader-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    className="bi bi-arrow-repeat commit-loader-hide loader-spin"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path
                      fillRule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                    />
                  </svg>
                </button>
              </td>
              <td>
                <select name="chP_user" id="chP_user">
                  <option defaultValue="Choose user">
                    {language.chooseUser}
                  </option>
                  {users.map((s) => (
                    <option
                      key={s.user.id}
                      value={s.user.id + "_" + s.user_name}
                    >
                      {s.user_name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select name="chP_chat" id="chP_chat">
                  <option defaultValue="Choose Group">
                    {language.chooseGroup}
                  </option>
                  {chat.map((s) => (
                    <option key={s.id} value={s.id + "_" + s.chat_name}>
                      {s.chat_name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input type="checkbox" id="chP_isAdmin" />
              </td>
            </tr>
          </tbody>
        </table>
        {participant && participant.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchParticipantsPage(p)}
                maxPages={maxPages}
              />
            </div>
            <div className="participants-table-info">
              <table className="eventList" style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>{language.email}</th>
                    <th>{language.chatName}</th>
                    <th>{language.admin}</th>
                    <th>{language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {participant.map((e) => {
                    if (filteredParticipants !== null)
                      if (
                        filteredParticipants.find((fp) => fp.id === e.id) ===
                        undefined
                      )
                        return <Fragment key={e.id} />;
                    return (
                      <tr key={e.id}>
                        <td>{e.user.email}</td>
                        <td>{e.chat_base.chat_name}</td>
                        <td style={{ textAlign: "center" }}>
                          {e.isChatAdmin ? (
                            <input type="checkbox" defaultChecked disabled />
                          ) : (
                            <input type="checkbox" disabled />
                          )}
                        </td>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              confirmDeleteParticipant(e.id);
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
            </div>
          </>
        ) : null}
      </div>

      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          deleteParticipant(idDelete);
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
