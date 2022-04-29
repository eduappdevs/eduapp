import React, { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../API";
import "../styles/schedulesessionslist.css";

export default function Schedulesessionslist() {
  const [sessions, setSessions] = useState([]);
  const [subject, setSubject] = useState([]);

  const FetchSessions = async () => {
    let payload = [];
    let request = await axios.get(API.endpoints.SESSIONS);
    request.data.map((e) => {
      let id = e.id;
      let name = e.session_name;
      let start = e.session_start_date;
      let end = e.session_end_date;
      let streamingPlatform = e.streaming_platform;
      let resourcesPlatform = e.resources_platform;
      let chat = e.session_chat_id;
      let subject = e.subject_id;
      let subject_name = e.subject.name;
      payload.push({
        id,
        name,
        start,
        end,
        streamingPlatform,
        resourcesPlatform,
        chat,
        subject,
        subject_name,
      });
      return true;
    });
    setSessions(payload);
  };

  const FetchSubjects = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.SUBJECTS).then((res) => {
        res.data.shift();
        setSubject(res.data);
      });
    });
  };

  const AddNewSession = (e) => {
    e.preventDefault();

    const context = [
      "session_name",
      "session_start_date",
      "session_end_date",
      "streaming_platform",
      "resources_platform",
      "session_chat_id",
      "subject_id",
    ];

    let json = [];
    let name = document.getElementById("s_name").value;
    let start_date = document.getElementById("s_start_date").value;
    let end_date = document.getElementById("s_end_date").value;
    let resources = document.getElementById("s_resources").value;
    let streaming = document.getElementById("s_streaming").value;
    let chat = 1;
    let subject = document.getElementById("s_subjectId").value;
    let subject_id = subject.split("_")[0];
    
    if (
      name !== "" &&
      start_date !== "" &&
      end_date !== "" &&
      resources !== "" &&
      streaming !== "" &&
      chat !== "" &&
      subject_id !== "Choose subject" &&
      subject_id !== ""
    ) {
      json.push(
        name,
        start_date,
        end_date,
        streaming,
        resources,
        chat,
        subject_id
      );
    } else {
      console.log("error");
    }

    let SessionJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      SessionJson[context[i]] = json[i];
    }
    axios
      .post(API.endpoints.SESSIONS, SessionJson)
      .then(() => {
        FetchSessions();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const deleteSession = (id) => {
    API.asynchronizeRequest(function () {
      axios
        .delete(`${API.endpoints.SESSIONS}/${id}`)
        .then(() => {
          FetchSessions();
        })
        .catch((e) => console.log(e));
    });
  };

  useEffect(() => {
    FetchSessions();
    FetchSubjects();
  }, []);

  return (
    <div className="schedulesesionslist-main-container">
      <table>
        <thead>
          <tr>
            <th>ADD</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Streaming</th>
            <th>Resources</th>
            <th>Chat Link</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <button onClick={AddNewSession}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                </svg>
              </button>
            </th>
            <th>
              <input id="s_name" type="text" placeholder="Name" autoComplete="off" />
            </th>
            <th>
              <input
                id="s_start_date"
                type="datetime-local"
                placeholder="Date"
              />
            </th>
            <th>
              <input id="s_end_date" type="datetime-local" placeholder="Date" />
            </th>
            <th>
              <input id="s_streaming" type="text" placeholder="Streaming"  autoComplete="off"/>
            </th>
            <th>
              <input id="s_resources" type="text" placeholder="Resources"  autoComplete="off"/>
            </th>
            <th>
              <input id="s_courseId" type="text" placeholder="Chat Group"  autoComplete="off"/>
            </th>
            <th className="subjecButton">
              <select id="s_subjectId">
                <option defaultValue="Choose subject">Choose subject</option>
                {subject.map((s) => (
                  <option key={s.id} value={s.id + "_" + s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </th>
          </tr>
        </tbody>
      </table>
      {sessions && sessions.length !== 0 ? (
        <table style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Streaming</th>
              <th>Resources</th>
              <th>Links</th>
              <th>Choose Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => {
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.start}</td>
                  <td>{s.end}</td>
                  <td>{s.streamingPlatform}</td>
                  <td>{s.resourcesPlatform}</td>
                  <td>{s.chat}</td>
                  <td>{s.subject_name}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        deleteSession(s.id);
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
      ) : null}
    </div>
  );
}