import React, { useEffect, useState } from "react";
import * as CHATSERVICE from "../Service/chat.service";
import * as API from "../API";

export default function ChatConfig() {
  const [chat, setChat] = useState([]);

  const fetchChat = async () => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.fetchChat().then((res) => {
        setChat(res);
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
    swapIconsDelete(true, event.target, id);
    API.asynchronizeRequest(function () {
      CHATSERVICE.deleteChat(id).then(() => {
        fetchChat();
        swapIconsDelete(false, event.target, id);
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

  useEffect(() => {
    fetchChat();
  }, []);
  return (
    <>
      <div className="chatConfig-main-container">
        <table className="createTable">
          <thead>
            <tr>
              <th>ADD</th>
              <th>Name</th>
              <th>Group</th>
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
                    Loading...
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
              <th>Name Group</th>
              <th>Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chat.map((e) => {
              return (
                <tr key={e.id}>
                  <td>{e.chat_name}</td>
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
                      id={e.id}
                      onClick={(event) => {
                        deleteChat(e.id, event);
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
                        Loading...
                      </div>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
