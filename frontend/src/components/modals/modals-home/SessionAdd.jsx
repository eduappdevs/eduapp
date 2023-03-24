import React from "react";
import axios from "axios";
import { EDUAPP_SESSIONS } from "../../../config";
import "./SessionModal.css";

/**
 * @deprecated
 */
export default function SessionAdd() {
  const AddNewSession = (e) => {
    e.preventDefault();

    const context = [
      "session_name",
      "session_date",
      "streaming_platform",
      "resources_platform",
      "session_chat_id",
      "course_id",
    ];
    let json = [];
    var obj = e.target;
    console.log(obj);
    let name = obj.session_name.value;
    let start = obj.start.value;
    let end = obj.end.value;
    let resources = obj.resources.value;
    let platform = obj.streaming.value;
    let date = start + "-" + end;
    console.log(date);
    let chat = obj.chat.value;
    let course_id = obj.course_id.value;

    json.push(name, date, resources, platform, chat, course_id);
    console.log(json);

    let SessionJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      SessionJson[context[i]] = json[i];
    }
    console.log(json);

    axios
      .post(EDUAPP_SESSIONS, SessionJson)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const close = () => {
    document
      .getElementsByClassName("ModalSessionAdd__main")[0]
      .classList.add("ModalSession__hidden");
  };

  return (
    <>
      <div className={"ModalSessionAdd__main ModalSession__hidden "}>
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
            <h1>Add Session</h1>
            <form className="addFormContent" onSubmit={AddNewSession}>
              <div>
                <label>Name:</label>
                <input name="session_name" type="text"></input>
              </div>
              <div className="schedule">
                <label>Schedule:</label>
                <div className="timeLabels">
                  <label htmlFor="start">Start</label>
                  <label htmlFor="end"> End</label>
                </div>

                <div className="timeInputs">
                  <input name="start" type="time"></input>
                  <input name="end" type="time"></input>
                </div>
              </div>
              <div>
                <label>Streaming:</label>
                <input name="streaming" type="text"></input>
              </div>
              <div>
                <label>Resources:</label>
                <input name="resources" type="text"></input>
              </div>
              <div>
                <label>Chat:</label>
                <input name="chat" type="text"></input>
              </div>
              <div>
                <label>Course:</label>
                <input name="course_id" type="text"></input>
              </div>
              <button
                className="home__buttonSubmit"
                type="submit"
                value="Submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
