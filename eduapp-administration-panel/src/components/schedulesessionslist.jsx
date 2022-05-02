import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as SCHEDULESERVICE from "../Service/schedule.service";
import * as SUBJECTSERVICE from "../Service/subject.service";
import "../styles/schedulesessionslist.css";

export default function Schedulesessionslist(props) {
  const [sessions, setSessions] = useState(null);
  const [search, setSearch] = useState("");
  const [sessionsBackup, setSBackup] = useState(null);
  const [subject, setSubject] = useState([]);
  const [subjectEdit, setSubjectEdit] = useState([]);
  const [editStartDate, setEditStart] = useState("");
  const [editEndDate, setEditEnd] = useState("");

  let sessions_filter = {};

  const FetchSessions = async () => {
    await API.asynchronizeRequest(function () {
      SCHEDULESERVICE.fetchSessions().then((e) => {
        setSessions(e.data);
        setSBackup(e.data);
        sessions_filter.sessions = e.data;
      });
    });
  };

  const FetchSubjects = async () => {
    await API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects().then((res) => {
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
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.createSession(SessionJson)
        .then(() => {
          FetchSessions();
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };
  const deleteSession = (id) => {
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.deleteSession(id)
        .then(() => {
          FetchSessions();
        })
        .catch((e) => console.log(e));
    });
  };

  const fetchSession = (sessionList) => {
    let filterSessions = [];
    sessionList.map((s) => {
      if (
        s.subject_id ===
        (sessions_filter.filter === -1
          ? s.subject_id
          : parseInt(sessions_filter.filter))
      )
        filterSessions.push(s);
      return true;
    });
    setSessions(filterSessions);
  };

  const editSession = () => {};
  const closeEditSession = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
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
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[1].childNodes[0];
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
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
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

  const showEditOptionSession = (e, id) => {
    if (e.target.tagName === "svg") {
      let name = e.target.parentNode.parentNode.parentNode.childNodes[1];
      let buttonDelete = e.target.parentNode.parentNode.childNodes[1];
      buttonDelete.style.display = "none";
      let button = e.target.parentNode.parentNode.childNodes[0];
      button.style.display = "none";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "block";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "block";
      name.disabled = false;
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
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
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
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

  useEffect(() => {
    FetchSessions();
    FetchSubjects();

    document.addEventListener("filter_subject", (e) => {
      e.stopImmediatePropagation();
      sessions_filter.filter =
        e.detail === "Choose subject" ? -1 : e.detail.split("_")[0];
      fetchSession(sessions_filter.sessions);
    });
  }, []);


  useEffect(()=>{
    setSearch(props.search)
  },[props.search])


  return (
    <div className="schedulesesionslist-main-container">
      <table>
        <thead>
          <tr>
            <th></th>
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
              <th>Chat Link</th>
              <th>Subject Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => {
              // setEditEnd(s.session_end_date);
              // setEditStart(s.session_start_date);
              if(search.length > 0 ){
                if(s.session_name.toLowerCase().includes(search.toLowerCase())){
                  
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <input type="text" disabled value={s.session_name} />
                  </td>
                  <td>
                    <input
                      id="s_start_date"
                      type="datetime-local"
                      value={s.session_start_date}
                      disabled
                      onChange={(e) => {
                        setEditStart(e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      id="s_end_date"
                      type="datetime-local"
                      value={s.session_end_date}
                      disabled
                      onChange={(e) => {
                        setEditEnd(e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input type="text" disabled value={s.streaming_platform} />
                  </td>
                  <td>
                    <input type="text" disabled value={s.resources_platform} />
                  </td>
                  <td>
                    <input type="text" disabled value={s.session_chat_id} />
                  </td>
                  <td>
                    <select id="s_subjectId">
                      <option defaultValue={s.subject.name}>
                        {s.subject.name}
                      </option>
                      {subjectEdit.map((s) => (
                        <option key={s.id} value={s.id + "_" + s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
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
                    <button
                      style={{ marginRight: "5px" }}
                      onClick={(e) => {
                        showEditOptionSession(e, s.id);
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
                      onClick={(e) => {
                        editSession(e, s);
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
                        closeEditSession(e, s.id);
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
              )}}
              else{
                return (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <input type="text" disabled value={s.session_name} />
                    </td>
                    <td>
                      <input
                        id="s_start_date"
                        type="datetime-local"
                        value={s.session_start_date}
                        disabled
                        onChange={(e) => {
                          setEditStart(e.target.value);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        id="s_end_date"
                        type="datetime-local"
                        value={s.session_end_date}
                        disabled
                        onChange={(e) => {
                          setEditEnd(e.target.value);
                        }}
                      />
                    </td>
                    <td>
                      <input type="text" disabled value={s.streaming_platform} />
                    </td>
                    <td>
                      <input type="text" disabled value={s.resources_platform} />
                    </td>
                    <td>
                      <input type="text" disabled value={s.session_chat_id} />
                    </td>
                    <td>
                      <select id="s_subjectId">
                        <option defaultValue={s.subject.name}>
                          {s.subject.name}
                        </option>
                        {subjectEdit.map((s) => (
                          <option key={s.id} value={s.id + "_" + s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
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
                      <button
                        style={{ marginRight: "5px" }}
                        onClick={(e) => {
                          showEditOptionSession(e, s.id);
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
                        onClick={(e) => {
                          editSession(e, s);
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
                          closeEditSession(e, s.id);
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
                )

              };
            })}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}