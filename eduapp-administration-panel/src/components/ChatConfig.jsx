/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useContext, useEffect, useState } from "react";
import * as CHATSERVICE from "../services/chat.service";
import * as API from "../API";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import PageSelect from "./pagination/PageSelect";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import useFilter from "../hooks/useFilter";
import { getChatFields } from "../constants/search_fields";
import "../styles/chatConfig.css";

export default function ChatConfig(props) {
  const [chat, setChat] = useState([]);

  const [newName] = useState();
  const [changeName, setChangeName] = useState(false);

  const [maxPages, setMaxPages] = useState(1);

  const [, setSearchParams] = useContext(SearchBarCtx);
  const filteredChats = useFilter(
    chat,
    null,
    CHATSERVICE.filterChats,
    getChatFields(props.language)
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
      document.getElementById("standard-modal").style.width = "100vw";
      document.getElementById("standard-modal").style.height = "100vh";
      document.getElementById("controlPanelContentContainer").style.overflow =
        "hidden";
    }
  };

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(props.language.connectionAlert);
    setPopupIcon("error");
  };

  const switchSaveState = (state) => {
    if (state) {
      document
        .getElementById("commit-loader-2")
        .classList.remove("commit-loader-hide");
      document.getElementById("add-svg").classList.add("commit-loader-hide");
    } else {
      document.getElementById("add-svg").classList.remove("commit-loader-hide");
      document
        .getElementById("commit-loader-2")
        .classList.add("commit-loader-hide");
    }
  };

  const showEditOptionChat = async (e, id) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0];
      let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
      buttonDelete.style.display = "none";
      let button = e.target.parentNode;
      button.style.display = "none";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "block";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "block";
      name.disabled = false;
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0]
            .childNodes[0];
        let buttonDelete =
          e.target.parentNode.parentNode.parentNode.childNodes[0];
        buttonDelete.style.display = "none";

        let button = e.target.parentNode.parentNode;
        button.style.display = "none";
        let checkButton =
          e.target.parentNode.parentNode.parentNode.childNodes[2];
        checkButton.style.display = "block";
        let cancelButton =
          e.target.parentNode.parentNode.parentNode.childNodes[3];
        cancelButton.style.display = "block";

        name.disabled = false;
      } else {
        let name = e.target.parentNode.parentNode.childNodes[0].childNodes[0];
        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "none";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "none";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "block";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "block";
        name.disabled = false;
      }
    }
  };

  const closeEditChat = async (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0];
      let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
      buttonDelete.style.display = "block";
      let button = e.target.parentNode.parentNode.childNodes[1];
      button.style.display = "block";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "none";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "none";
      name.disabled = true;
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0]
            .childNodes[0];
        let buttonDelete =
          e.target.parentNode.parentNode.parentNode.childNodes[0];
        buttonDelete.style.display = "block";
        let button = e.target.parentNode.parentNode.parentNode.childNodes[1];
        button.style.display = "block";
        let checkButton =
          e.target.parentNode.parentNode.parentNode.childNodes[2];
        checkButton.style.display = "none";
        let cancelButton =
          e.target.parentNode.parentNode.parentNode.childNodes[3];
        cancelButton.style.display = "none";
        name.disabled = true;
      } else {
        let name =
          e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0]
            .childNodes[0];
        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "block";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "block";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "none";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "none";
        name.disabled = true;
      }
    }
  };

  const editChat = async (e, data) => {
    switchEditState(false);
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0];

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
          .then((e) => {
            if (e) {
              setIsConfirmDelete(false);
              setPopup(true);
              setPopupType("info");
              setPopupText(props.language.editAlertCompleted);
              fetchChatPage(1);
              setChangeName(false);
              let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
              buttonDelete.style.display = "block";
              let button = e.target.parentNode.parentNode.childNodes[1];
              button.style.display = "block";
              let checkButton = e.target.parentNode.parentNode.childNodes[2];
              checkButton.style.display = "none";
              let cancelButton = e.target.parentNode.parentNode.childNodes[3];
              cancelButton.style.display = "none";
              name.disabled = true;
            }
          })
          .catch(async (e) => {
            if (e) {
              await interceptExpiredToken(e);
              setIsConfirmDelete(false);
              setPopupText(props.language.editAlertFailed);
              setPopupIcon("error");
              switchSaveState(false);
              setPopup(true);
            }
          });
      }).then(async (e) => {
        if (e) {
          await interceptExpiredToken(e);
          connectionAlert();
        }
      });
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0]
            .childNodes[0];
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
            .then((e) => {
              if (e) {
                setIsConfirmDelete(false);
                setPopup(true);
                setPopupType("info");
                setPopupText(props.language.editAlertCompleted);
                fetchChatPage(1);
                setChangeName(false);

                let buttonDelete =
                  e.target.parentNode.parentNode.parentNode.childNodes[0];
                buttonDelete.style.display = "block";
                let button =
                  e.target.parentNode.parentNode.parentNode.childNodes[1];
                button.style.display = "block";
                let checkButton =
                  e.target.parentNode.parentNode.parentNode.childNodes[2];
                checkButton.style.display = "none";
                let cancelButton =
                  e.target.parentNode.parentNode.parentNode.childNodes[3];
                cancelButton.style.display = "none";
                name.disabled = true;
              }
            })
            .catch(async (e) => {
              if (e) {
                await interceptExpiredToken(e);
                setIsConfirmDelete(false);
                setPopupText(props.language.editAlertFailed);
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
              }
            });
        }).then(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            connectionAlert();
          }
        });
      } else {
        let name = e.target.parentNode.parentNode.childNodes[0].childNodes[0];
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
            .then(() => {
              if (e) {
                let buttonDelete = e.target.parentNode.childNodes[0];
                buttonDelete.style.display = "block";
                let button = e.target.parentNode.childNodes[1];
                button.style.display = "block";
                let checkButton = e.target.parentNode.childNodes[2];
                checkButton.style.display = "none";
                let cancelButton = e.target.parentNode.childNodes[3];
                cancelButton.style.display = "none";
                name.disabled = true;
                setIsConfirmDelete(false);
                setPopup(true);
                setPopupType("info");
                setPopupText(props.language.editAlertCompleted);
                fetchChatPage(1);
                setChangeName(false);
              }
            })
            .catch(async (e) => {
              if (e) {
                await interceptExpiredToken(e);
                setIsConfirmDelete(false);
                setPopupText(props.language.editAlertFailed);
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
              }
            });
        }).then(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            connectionAlert();
          }
        });
      }
    }
  };

  const fetchChatPage = async (page) => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.pagedChat(page)
        .then((res) => {
          setChat(res.data.current_page);
          setMaxPages(res.data.total_pages);
        })
        .catch(async (err) => await interceptExpiredToken(err));
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const alertCreate = async () => {
    switchEditState(false);
    setPopupText(props.language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const addChat = async (e) => {
    switchSaveState(false);

    e.preventDefault();
    const context = ["chat_name", "isGroup"];
    let json = [];
    let name = document.getElementById("ch_chat_name").value;
    let isGroup = document.getElementById("ch_isGroup").checked;

    if (name !== "" && isGroup !== null) {
      json.push(name, isGroup);
    } else {
      alertCreate();
      switchSaveState(false);
      return;
    }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      CHATSERVICE.createChat(eventJson)
        .then(() => {
          fetchChatPage(1);
          setPopup(true);
          setPopupType("info");
          setPopupText(props.language.creationCompleted);
          switchSaveState(false);
        })
        .catch(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            alertCreate();
            switchSaveState(false);
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
    switchEditState(false);
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText(props.language.deleteAlert);
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(id);
  };

  const showDeleteError = () => {
    switchEditState(false);
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText(props.language.deleteAlertFailed);
    setIsConfirmDelete(false);
  };

  const deleteChat = async (id) => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.deleteChat(id)
        .then(() => {
          fetchChatPage(1);
          setPopup(true);
          setPopupType("info");
          setPopupText(props.language.deleteAlertCompleted);
          setIsConfirmDelete(false);
        })
        .catch(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            showDeleteError();
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

  useEffect(() => fetchChatPage(1), []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getChatFields(props.language),
      selectedField: getChatFields(props.language)[0][0],
    });
  }, [props.language]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th>{props.language.add}</th>
              <th>{props.language.name}</th>
              <th>{props.language.group}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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
              <td>
                <input
                  type="text"
                  name="chat_name"
                  id="ch_chat_name"
                  placeholder="Name"
                />
              </td>
              <td>
                <input type="checkbox" id="ch_isGroup" />
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
                    <th>{props.language.name}</th>
                    <th>{props.language.group}</th>
                    <th>{props.language.actions}</th>
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
