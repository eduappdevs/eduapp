import axios from "axios";
import React from "react";
import { EDUAPP_SESSIONS } from "../../../config";
import "./SessionModal.css";

/**
 * @deprecated
 */
export default function SessionEdit({ fields }) {
  const close = () => {
    document
      .getElementsByClassName("ModalSessionEdit__main")[0]
      .classList.add("ModalSession__hidden");
  };

  const editSession = (e) => {
    const name = document.getElementById("name").value;
    const date1 = document.getElementById("date1").value;
    const date2 = document.getElementById("date2").value;
    const streaming = document.getElementById("streaming").value;
    const resources = document.getElementById("resources").value;
    const chat = document.getElementById("chat").value;
    let date = date1 + "-" + date2;

    const newSession = {
      session_name: name,
      session_date: date,
      streaming_platform: streaming,
      resources_platform: resources,
      session_chat_id: chat,
    };

    e.preventDefault();
    axios.patch(EDUAPP_SESSIONS + fields.id, newSession).then((res) => {
      console.log(res);
      console.log(res.data);

      window.location.reload();
    });
  };

  return (
    <div
      id="ModalSessionEdit"
      className={"ModalSessionEdit__main ModalSession__hidden"}
    >
      <div className="home__addForm" id="home__addFormID">
        <div className="informationForm">
          <div className="buttonClose" onClick={close}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-x-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <h1>Edit Session</h1>
          <form className="addFormContent" onSubmit={editSession}>
            <div>
              <label>Name:</label>
              <input
                id="name"
                name="session_name"
                type="text"
                defaultValue={fields.session_name}
              ></input>
            </div>
            <div className="schedule">
              <label>Schedule:</label>
              <div className="timeLabels">
                <label htmlFor="start">Start</label>
                <label htmlFor="end"> End</label>
              </div>
              <div className="timeInputs">
                <input
                  id="date1"
                  name="start"
                  type="time"
                  defaultValue={fields.session_date1}
                ></input>
                <input
                  id="date2"
                  name="end"
                  type="time"
                  defaultValue={fields.session_date2}
                ></input>
              </div>
            </div>
            <div>
              <label>Streaming:</label>
              <input
                id="streaming"
                name="streaming"
                type="text"
                defaultValue={fields.streaming_platform}
              ></input>
            </div>
            <div>
              <label>Resources:</label>
              <input
                id="resources"
                name="resources"
                type="text"
                defaultValue={fields.resources_platform}
              ></input>
            </div>
            <div>
              <label>Chat:</label>
              <input
                id="chat"
                name="chat"
                type="text"
                defaultValue={fields.session_chat_id}
              ></input>
            </div>
            <button className="home__buttonSubmit" type="submit" value="Submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
