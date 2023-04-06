/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useContext, useEffect, useState } from "react";
import * as CHATSERVICE from "../services/chat.service";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as API from "../API";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import PageSelect from "./pagination/PageSelect";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import useFilter from "../hooks/useFilter";
import { getChatFields } from "../constants/search_fields";
import "../styles/chatConfig.css";
import { LoaderCtx } from "../hooks/LoaderContext";

export default function ChatConfig() {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [chat, setChat] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [hasDoneInitialFetch, setInitialFetch] = useState(false);
  const [language] = useContext(LanguageCtx);

  const [newName] = useState();
  const [changeName, setChangeName] = useState(false);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);
  const filteredChats = useFilter(
    chat,
    null,
    CHATSERVICE.filterChats,
    getChatFields(language)
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

  const fetchChatPage = async (page, order = null) => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.pagedChat(page, order)
        .then((res) => {
          setChat(res.data.current_page);
          setMaxPages(res.data.total_pages);
          setActualPage(res.data.page);
        })
        .catch(async (err) => await interceptExpiredToken(err));
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchSubjects = async () => {
    let subjects = await SUBJECTSERVICE.fetchSubjects();
    setSubjects(subjects.data);
  };

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  };

  const finalizedEdit = (type, icon, text, confirmDel) => {
    fetchChatPage(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  };

  const finalizedCreate = (type, icon, txt, confirmDel) => {
    fetchChatPage(actualPage);
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
    fetchChatPage(actualPage);
  };

  const showEditOptionChat = async (e) => {
    e.target.parentNode.parentNode.childNodes[0].childNodes[0].disabled = false;
    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === ""
        ? e.target.parentNode.childNodes[num].style.display === "none"
          ? (e.target.parentNode.childNodes[num].style.display = "block")
          : (e.target.parentNode.childNodes[num].style.display = "none")
        : e.target.parentNode.childNodes[num].style.display === "block"
          ? (e.target.parentNode.childNodes[num].style.display = "none")
          : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const closeEditChat = async (e) => {
    e.preventDefault();
    e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].disabled = true;
    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const editChat = async (e, data) => {
    switchEditState(false);
    let inputName = document.getElementById("inputName_" + data.id).value;

    let editTitle;

    if (inputName !== "" && inputName !== data.chat_name) {
      editTitle = inputName;
    } else {
      editTitle = data.chat_name;
    }

    API.asynchronizeRequest(function () {
      CHATSERVICE.editChat({
        id: data.id,
        chat_name: editTitle,
        isGroup: data.isGroup,
      })
        .then((x) => {
          if (x) {
            let num = 0;
            while (num < 4) {
              e.target.parentNode.childNodes[num].style.display === "block"
                ? (e.target.parentNode.childNodes[num].style.display = "none")
                : (e.target.parentNode.childNodes[num].style.display = "block");
              num += 1;
            }
            e.target.parentNode.parentNode.childNodes[0].childNodes[0].disabled = true;
            finalizedEdit("info", true, language.editAlertCompleted, false);
            setChangeName(false);
          }
        })
        .catch(async (x) => {
          if (x) {
            finalizedEdit("error", true, language.editAlertFailed, false);
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

  const addChat = async (e) => {
    switchEditState(false);
    e.preventDefault();
    const context = ["chat_name", "isGroup"];
    let json = [];
    let name = document.getElementById("ch_chat_name").value;
    let isGroup = document.getElementById("ch_isGroup").checked;

    if (name !== "" && isGroup !== null) {
      json.push(name, isGroup);
    } else {
      finalizedCreate("error", true, language.creationFailed, false);
      return;
    }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      CHATSERVICE.createChat(eventJson)
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
    return;
  };

  const confirmDeleteEvent = async (id) => {
    finalizedDelete("warning", true, true, language.deleteAlert);
    switchEditState(false);
    setIdDelete(id);
  };

  const deleteChat = async (id) => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.deleteChat(id)
        .then((e) => {
          if (e) {
            finalizedDelete("info", true, false, language.deleteAlertCompleted);
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedDelete("error", true, false, language.deleteAlertFailed);
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

  const handleChange = (id) => {
    setChangeName(true);
    return document.getElementById("inputName_" + id).value;
  };

  useEffect(() => {
    fetchChatPage(1);
    fetchSubjects();
    setInitialFetch(true);
  }, []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getChatFields(language),
      selectedField: getChatFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  useEffect(() => {
    if (hasDoneInitialFetch) {
      fetchChatPage(1, {
        field: searchParams.selectedField,
        order: searchParams.order,
      });
    }
  }, [searchParams.order]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{language.name}</th>
              <th>{language.group}</th>
              <th>{language.add}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {language.add}:
              </td>
              <td>
                <input
                  type="text"
                  name="chat_name"
                  id="ch_chat_name"
                  placeholder={language.name}
                />
              </td>
              <td>
                <input type="checkbox" id="ch_isGroup" />
              </td>
              <td>
                <button onClick={addChat}>
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
            </tr>
          </tbody>
        </table>

        {chat && chat.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchChatPage(p)}
                maxPages={maxPages}
              />
            </div>

            <div className="chat-table-info">
              <table className="eventList" style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>{language.code}</th>
                    <th>{language.name}</th>
                    <th>{language.group}</th>
                    <th>{language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {chat.map((e) => {
                    if (filteredChats !== null)
                      if (
                        filteredChats.find((fc) => fc.id === e.id) === undefined
                      )
                        return <Fragment key={e.id} />;
                    return (
                      <tr key={e.id}>
                        <td>
                          <input disabled type="text" value={e.id} />
                        </td>
                        <td>
                          <input
                            id={"inputName_" + e.id}
                            disabled
                            type="text"
                            value={changeName === false ? e.chat_name : newName}
                            onChange={() => {
                              handleChange(e.id);
                            }}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {e.isGroup ? (
                            <input type="checkbox" disabled checked />
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
                            style={{ marginRight: "5px" }}
                            id={e.id}
                            onClick={() => {
                              confirmDeleteEvent(e.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash3"
                              viewBox="0 0 16 16"
                              id="ins-delete-icon"
                            >
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                            </svg>
                          </button>
                          <button
                            style={{ marginRight: "5px" }}
                            onClick={(event) => {
                              showEditOptionChat(event);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                          </button>
                          <button
                            style={{ marginRight: "5px", display: "none" }}
                            onClick={(event) => {
                              editChat(event, e);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                            </svg>
                          </button>
                          <button
                            style={{ display: "none" }}
                            onClick={(e) => {
                              closeEditChat(e);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-x-lg"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                              />
                              <path
                                fillRule="evenodd"
                                d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                              />
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
          deleteChat(idDelete);
          switchEditState(true);
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
