import React, { useEffect, useState } from "react";
import * as CHATSERVICE from "../services/chat.service";
import * as API from "../API";
import "../styles/chatConfig.css";
import { interceptExpiredToken } from "../utils/OfflineManager";

export default function ChatConfig(props) {
  const [chat, setChat] = useState([]);
  const [chatId, setChatId] = useState();

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
          e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0]
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
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0];
      let value = document.getElementById("inputName_" + data.id);
      if (value.value !== "") {
        CHATSERVICE.editChat({
          id: data.id,
          chat_name: value.value,
          isGroup: data.isGroup,
        })
          .then(() => {
            fetchChat();
            let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
            buttonDelete.style.display = "block";
            let button = e.target.parentNode.parentNode.childNodes[1];
            button.style.display = "block";
            let checkButton = e.target.parentNode.parentNode.childNodes[2];
            checkButton.style.display = "none";
            let cancelButton = e.target.parentNode.parentNode.childNodes[3];
            cancelButton.style.display = "none";
            name.disabled = true;
          })
          .catch(async (err) => {
            await interceptExpiredToken(err);
            console.error(err);
          });
      } else {
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
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0]
            .childNodes[0];
        let value = document.getElementById("inputName_" + data.id);
        if (value.value !== "") {
          CHATSERVICE.editChat({
            id: data.id,
            chat_name: value.value,
            isGroup: data.isGroup,
          })
            .then(() => {
              fetchChat();
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
            })
            .catch(async (err) => {
              await interceptExpiredToken(err);
              console.error(err);
            });
        } else {
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
        }
      } else {
        let name = e.target.parentNode.parentNode.childNodes[0].childNodes[0];
        let value = document.getElementById("inputName_" + data.id);
        if (value.value !== "") {
          CHATSERVICE.editChat({
            id: data.id,
            chat_name: value.value,
            isGroup: data.isGroup,
          })
            .then(() => {
              let buttonDelete = e.target.parentNode.childNodes[0];
              buttonDelete.style.display = "block";
              let button = e.target.parentNode.childNodes[1];
              button.style.display = "block";
              let checkButton = e.target.parentNode.childNodes[2];
              checkButton.style.display = "none";
              let cancelButton = e.target.parentNode.childNodes[3];
              cancelButton.style.display = "none";
              name.disabled = true;

              fetchChat();
            })
            .catch(async (err) => {
              await interceptExpiredToken(err);
              console.error(err);
            });
        } else {
          let buttonDelete = e.target.parentNode.childNodes[0];
          buttonDelete.style.display = "block";
          let button = e.target.parentNode.childNodes[1];
          button.style.display = "block";
          let checkButton = e.target.parentNode.childNodes[2];
          checkButton.style.display = "none";
          let cancelButton = e.target.parentNode.childNodes[3];
          cancelButton.style.display = "none";
          name.disabled = true;
          console.log(name);
        }
      }
    }
  };

  const fetchChat = async () => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.fetchChat()
        .then((res) => {
          setChat(res.data);
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          console.error(err);
        });
    });
  };

  const addChat = async (e) => {
    swapIcons(true);
    e.preventDefault();
    const context = ["chat_name", "isGroup"];
    let json = [];
    let name = document.getElementById("ch_chat_name").value;
    let isGroup = document.getElementById("ch_isGroup").checked;
    if (name !== "" && isGroup !== null) {
      json.push(name, isGroup);
    } else {
      console.log("error");
    }
    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      CHATSERVICE.createChat(eventJson).then(() => {
        fetchChat();
        swapIcons(false);
      });
    });
    return;
  };

  const deleteChat = async (id, event) => {
    document.getElementById("alert_delete").style.display = "block";
    swapIconsDelete(true, event.target, id);
    API.asynchronizeRequest(function () {
      CHATSERVICE.deleteChat(id)
        .then(() => {
          fetchChat();
          swapIconsDelete(false, event.target, id);
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          console.error(err);
        });
    });
  };

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
      document.getElementById("ins-add-icon").style.display = "none";
    } else {
      document.getElementById("submit-loader").style.display = "none";
      document.getElementById("ins-add-icon").style.display = "block";
    }
  };
  const swapIconsDelete = (state, button, id) => {
    let deleteIcon = button.childNodes[0];
    let deleteLoader = button.childNodes[1];

    if (state) {
      if (button.tagName === "button") {
        deleteLoader.style.display = "block";
        deleteIcon.style.display = "none";
      } else {
        let buttonDelete = document.getElementById(id);
        let deleteIcon = buttonDelete.childNodes[0];
        let deleteLoader = buttonDelete.childNodes[1];
        deleteLoader.style.display = "block";
        deleteIcon.style.display = "none";
      }
    } else {
      deleteLoader.style.display = "none";
      deleteIcon.style.display = "block";
    }
  };

  const handleChange = (id) => {
    var content = document.getElementById("inputName_" + id);
    return content.value;
  };

  const closeAlertDelete = () => {
    document.getElementById("alert_delete").style.display = "none";
  };

  const showAlertDelete = (id) => {
    document.getElementById("alert_delete").style.display = "block";
    setChatId(id);
  };

  useEffect(() => {
    fetchChat();
  }, []);

  return (
    <>
      <div className="chatConfig-main-container">
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
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                    id="ins-add-icon"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                  <div id="submit-loader" className="loader">
                    {props.language.loading} ...
                  </div>
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
        <table className="eventList" style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th>{props.language.name}</th>
              <th>{props.language.group}</th>
              <th>{props.language.actions}</th>
            </tr>
          </thead>
          <tbody>
            {chat.map((e) => {
              return (
                <tr key={e.id}>
                  <td>
                    <input
                      id={"inputName_" + e.id}
                      disabled
                      type="text"
                      placeholder={e.chat_name}
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
                        showAlertDelete(e.id);
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
                      <div id="delete-loader" className="loader">
                        {props.language.loading} ...
                      </div>
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
      <div className="alert-delete" id="alert_delete">
        <div className="contianer-alert-delete">
          <div className="header-container-alert-delete"></div>
          <div className="contents-continer-alert-delete">
            <h2>{props.language.alertDeleteChat}</h2>
            <div className="contents-continer-button-alert-delete">
              <p
                id="delete_contents"
                onClick={(event) => {
                  deleteChat(chatId, event);
                }}
              >
                {props.language.yes}
              </p>
              <p id="close_alert" onClick={closeAlertDelete}>
                {props.language.no}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
