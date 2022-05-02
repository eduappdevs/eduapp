import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as SCHEDULESERVICE from "../service/schedule.service";
import * as SUBJECTSERVICE from "../service/subject.service";
import "../styles/schedulesessionslist.css";

export default function Schedulesessionslist() {
  const [sessions, setSessions] = useState(null);
  const [sessionsBackup, setSBackup] = useState(null);
  const [subject, setSubject] = useState([]);
  const [subjectEdit, setSubjectEdit] = useState([]);
  const [newEndDate] = useState();
  const [newStartDate] = useState();
  const [changeEndDate, setChangeEndDate] = useState(false);
  const [changeStartDate, setChangeStartDate] = useState(false);

  let sessions_filter = {};

  const fetchSessions = async () => {
    await API.asynchronizeRequest(function () {
      SCHEDULESERVICE.fetchSessions().then((e) => {
        setSessions(e.data);
        setSBackup(e.data);
        sessions_filter.sessions = e.data;
      });
    });
  };

  const fetchSubjects = async () => {
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
          fetchSessions();
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
          fetchSessions();
        })
        .catch((e) => console.log(e));
    });
  };

  const sessionFilter = (sessionList) => {
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

  const editSession = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let streaming =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let resources =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let chat =
        e.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      let inputName = document.getElementById("inputName_" + s.id).value;
      let inputStartDate = document.getElementById(
        "inputStartDate_" + s.id
      ).value;
      let inputEndDate = document.getElementById("inputEndDate_" + s.id).value;
      let inputStreamPlatform = document.getElementById(
        "inputStreamPlatform_" + s.id
      ).value;
      let inputResourcePlatform = document.getElementById(
        "inputResourcePlatform_" + s.id
      ).value;
      let inputSessionChat = document.getElementById(
        "inputSessionChat_" + s.id
      ).value;
      let inputSubject = document.getElementById(
        "inputSubjectID_" + s.id
      ).value;
      let editTitle,
        editStartDate,
        editEndDate,
        editChat,
        editResources,
        editStream,
        editSubject;

      if (inputName !== "" && inputName !== s.session_name) {
        editTitle = inputName;
      } else {
        editTitle = s.session_name;
      }

      if (inputStartDate !== "" && inputStartDate !== s.session_start_date) {
        editStartDate = inputStartDate;
      } else {
        editStartDate = s.session_start_date;
      }

      if (inputEndDate !== "" && inputEndDate !== s.session_end_date) {
        editEndDate = inputEndDate;
      } else {
        editEndDate = s.session_end_date;
      }

      if (inputSessionChat !== "" && inputSessionChat !== s.session_chat_id) {
        editChat = inputSessionChat;
      } else {
        editChat = s.session_chat_id;
      }

      if (
        inputResourcePlatform !== "" &&
        inputResourcePlatform !== s.resources_platform
      ) {
        editResources = inputResourcePlatform;
      } else {
        editResources = s.resources_platform;
      }

      if (
        inputStreamPlatform !== "" &&
        inputStreamPlatform !== s.streaming_platform
      ) {
        editStream = inputStreamPlatform;
      } else {
        editStream = s.streaming_platform;
      }

      if (inputSubject !== "" && inputSubject !== s.subject_id) {
        editSubject = inputSubject;
      } else {
        editSubject = s.subject_id;
      }

      API.asynchronizeRequest(function () {
        SCHEDULESERVICE.editSession({
          id: s.id,
          session_name: editTitle,
          session_start_date: editStartDate,
          session_end_date: editEndDate,
          streaming_platform: editStream,
          resources_platform: editResources,
          session_chat_id: editChat,
          subject_id: editSubject,
        })
          .then(() => {
            fetchSessions();
            fetchSubjects();

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
            startDate.disabled = true;
            endDate.disabled = true;
            streaming.disabled = true;
            resources.disabled = true;
            chat.disabled = true;
            subject.disabled = true;
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[5]
            .childNodes[0];
        let chat =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[6]
            .childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[7]
            .childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputStartDate = document.getElementById(
          "inputStartDate_" + s.id
        ).value;
        let inputEndDate = document.getElementById(
          "inputEndDate_" + s.id
        ).value;
        let inputStreamPlatform = document.getElementById(
          "inputStreamPlatform_" + s.id
        ).value;
        let inputResourcePlatform = document.getElementById(
          "inputResourcePlatform_" + s.id
        ).value;
        let inputSessionChat = document.getElementById(
          "inputSessionChat_" + s.id
        ).value;
        let inputSubject = document.getElementById(
          "inputSubjectID_" + s.id
        ).value;
        let editTitle,
          editStartDate,
          editEndDate,
          editChat,
          editResources,
          editStream,
          editSubject;

        if (inputName !== "" && inputName !== s.session_name) {
          editTitle = inputName;
        } else {
          editTitle = s.session_name;
        }

        if (inputStartDate !== "" && inputStartDate !== s.session_start_date) {
          editStartDate = inputStartDate;
        } else {
          editStartDate = s.session_start_date;
        }

        if (inputEndDate !== "" && inputEndDate !== s.session_end_date) {
          editEndDate = inputEndDate;
        } else {
          editEndDate = s.session_end_date;
        }

        if (inputSessionChat !== "" && inputSessionChat !== s.session_chat_id) {
          editChat = inputSessionChat;
        } else {
          editChat = s.session_chat_id;
        }

        if (
          inputResourcePlatform !== "" &&
          inputResourcePlatform !== s.resources_platform
        ) {
          editResources = inputResourcePlatform;
        } else {
          editResources = s.resources_platform;
        }

        if (
          inputStreamPlatform !== "" &&
          inputStreamPlatform !== s.streaming_platform
        ) {
          editStream = inputStreamPlatform;
        } else {
          editStream = s.streaming_platform;
        }

        if (inputSubject !== "" && inputSubject !== s.subject_id) {
          editSubject = inputSubject;
        } else {
          editSubject = s.subject_id;
        }

        API.asynchronizeRequest(function () {
          SCHEDULESERVICE.editSession({
            id: s.id,
            session_name: editTitle,
            session_start_date: editStartDate,
            session_end_date: editEndDate,
            streaming_platform: editStream,
            resources_platform: editResources,
            session_chat_id: editChat,
            subject_id: editSubject,
          })
            .then(() => {
              fetchSessions();
              fetchSubjects();

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
              startDate.disabled = true;
              endDate.disabled = true;
              streaming.disabled = true;
              resources.disabled = true;
              chat.disabled = true;
              subject.disabled = true;
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
        let chat =
          e.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputStartDate = document.getElementById(
          "inputStartDate_" + s.id
        ).value;
        let inputEndDate = document.getElementById(
          "inputEndDate_" + s.id
        ).value;
        let inputStreamPlatform = document.getElementById(
          "inputStreamPlatform_" + s.id
        ).value;
        let inputResourcePlatform = document.getElementById(
          "inputResourcePlatform_" + s.id
        ).value;
        let inputSessionChat = document.getElementById(
          "inputSessionChat_" + s.id
        ).value;
        let inputSubject = document.getElementById(
          "inputSubjectID_" + s.id
        ).value;
        let editTitle,
          editStartDate,
          editEndDate,
          editChat,
          editResources,
          editStream,
          editSubject;

        if (inputName !== "" && inputName !== s.session_name) {
          editTitle = inputName;
        } else {
          editTitle = s.session_name;
        }

        if (inputStartDate !== "" && inputStartDate !== s.session_start_date) {
          editStartDate = inputStartDate;
        } else {
          editStartDate = s.session_start_date;
        }

        if (inputEndDate !== "" && inputEndDate !== s.session_end_date) {
          editEndDate = inputEndDate;
        } else {
          editEndDate = s.session_end_date;
        }

        if (inputSessionChat !== "" && inputSessionChat !== s.session_chat_id) {
          editChat = inputSessionChat;
        } else {
          editChat = s.session_chat_id;
        }

        if (
          inputResourcePlatform !== "" &&
          inputResourcePlatform !== s.resources_platform
        ) {
          editResources = inputResourcePlatform;
        } else {
          editResources = s.resources_platform;
        }

        if (
          inputStreamPlatform !== "" &&
          inputStreamPlatform !== s.streaming_platform
        ) {
          editStream = inputStreamPlatform;
        } else {
          editStream = s.streaming_platform;
        }

        if (inputSubject !== "" && inputSubject !== s.subject_id) {
          editSubject = inputSubject;
        } else {
          editSubject = s.subject_id;
        }

        API.asynchronizeRequest(function () {
          SCHEDULESERVICE.editSession({
            id: s.id,
            session_name: editTitle,
            session_start_date: editStartDate,
            session_end_date: editEndDate,
            streaming_platform: editStream,
            resources_platform: editResources,
            session_chat_id: editChat,
            subject_id: editSubject,
          })
            .then(() => {
              fetchSessions();
              fetchSubjects();

              let buttonDelete = e.target.parentNode.childNodes[0];
              buttonDelete.style.display = "block";
              let button = e.target.parentNode.childNodes[1];
              button.style.display = "block";
              let checkButton = e.target.parentNode.childNodes[2];
              checkButton.style.display = "none";
              let cancelButton = e.target.parentNode.childNodes[3];
              cancelButton.style.display = "none";
              name.disabled = true;
              startDate.disabled = true;
              endDate.disabled = true;
              streaming.disabled = true;
              resources.disabled = true;
              chat.disabled = true;
              subject.disabled = true;
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    }
  };
  const closeEditSession = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let streaming =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let resources =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let chat =
        e.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      name.disabled = true;
      startDate.disabled = true;
      endDate.disabled = true;
      streaming.disabled = true;
      resources.disabled = true;
      chat.disabled = true;
      subject.disabled = true;
      let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
      buttonDelete.style.display = "block";
      let button = e.target.parentNode.parentNode.childNodes[1];
      button.style.display = "block";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "none";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "none";
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[1].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[5].childNodes[0];
        let chat =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[6].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[7].childNodes[0];
        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        streaming.disabled = true;
        resources.disabled = true;
        chat.disabled = true;
        subject.disabled = true;
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
        let startDate =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let chat = e.target.parentNode.parentNode.childNodes[6].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];
        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        streaming.disabled = true;
        resources.disabled = true;
        chat.disabled = true;
        subject.disabled = true;
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

  const showEditOptionSession = (e, S) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let streaming =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let resources =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let chat =
        e.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      name.disabled = false;
      startDate.disabled = false;
      endDate.disabled = false;
      streaming.disabled = false;
      resources.disabled = false;
      chat.disabled = false;
      subject.disabled = false;
      let buttonDelete = e.target.parentNode.parentNode.childNodes[1];
      buttonDelete.style.display = "none";
      let button = e.target.parentNode.parentNode.childNodes[0];
      button.style.display = "none";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "block";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "block";
      listSubject(subject.value);
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[5]
            .childNodes[0];
        let chat =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[6]
            .childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[7]
            .childNodes[0];
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        streaming.disabled = false;
        resources.disabled = false;
        chat.disabled = false;
        subject.disabled = false;

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
        listSubject(subject.value);
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let chat = e.target.parentNode.parentNode.childNodes[6].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        streaming.disabled = false;
        resources.disabled = false;
        chat.disabled = false;
        subject.disabled = false;
        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "none";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "none";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "block";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "block";
        listSubject(subject.value);
      }
    }
  };

  const listSubject = (sub) => {
    let list_subject = [];
    subject.map((s) => {
      if (s.name !== sub) {
        list_subject.push(s);
      }
      return true;
    });
    setSubjectEdit(list_subject);
  };

  const handleChangeEndDate = (id) => {
    let content = document.getElementById("inputEndDate_" + id);
    setChangeEndDate(true);
    return content.value;
  };

  const handleChangeStartDate = (id) => {
    let content = document.getElementById("inputStartDate_" + id);
    setChangeStartDate(true);
    return content.value;
  };

  const handleChangeName = (id) => {
    var content = document.getElementById("inputName_" + id);
    return content.value;
  };

  const handleChangeStreamPlatform = (id) => {
    var content = document.getElementById(`inputStreamPlatform_${id}`);
    return content.value;
  };

  const handleChangeResourcesPlatform = (id) => {
    var content = document.getElementById(`inputResourcesPlatform_${id}`);
    return content.value;
  };

  const handleChangeSessionChat = (id) => {
    var content = document.getElementById(`inputSessionChat_${id}`);
    return content.value;
  };

  useEffect(() => {
    fetchSessions();
    fetchSubjects();

    document.addEventListener("filter_subject", (e) => {
      e.stopImmediatePropagation();
      sessions_filter.filter =
        e.detail === "Choose subject" ? -1 : e.detail.split("_")[0];
      sessionFilter(sessions_filter.sessions);
    });
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
              <input id="s_name" type="text" placeholder="Name" />
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
              <input id="s_streaming" type="text" placeholder="Streaming" />
            </th>
            <th>
              <input id="s_resources" type="text" placeholder="Resources" />
            </th>
            <th>
              <input id="s_courseId" type="text" placeholder="Chat Group" />
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
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <input
                      id={`inputName_${s.id}`}
                      type="text"
                      disabled
                      placeholder={s.session_name}
                      onChange={(e) => {
                        handleChangeName(e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      id={`inputStartDate_${s.id}`}
                      type="datetime-local"
                      value={
                        changeStartDate === false
                          ? s.session_start_date
                          : newStartDate
                      }
                      disabled
                      onChange={(e) => {
                        handleChangeStartDate(e, s.id);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      id={`inputEndDate_${s.id}`}
                      type="datetime-local"
                      value={
                        changeEndDate === false
                          ? s.session_end_date
                          : newEndDate
                      }
                      disabled
                      onChange={(e) => {
                        handleChangeEndDate(e, s.id);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      id={`inputStreamPlatform_${s.id}`}
                      type="text"
                      disabled
                      placeholder={
                        s.streaming_platform === null
                          ? ""
                          : s.streaming_platform
                      }
                      onChange={() => {
                        handleChangeStreamPlatform(s.id);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      id={`inputResourcePlatform_${s.id}`}
                      type="text"
                      disabled
                      placeholder={
                        s.resources_platform === null
                          ? ""
                          : s.resources_platform
                      }
                      onChange={() => {
                        handleChangeResourcesPlatform(s.id);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      id={`inputSessionChat_${s.id}`}
                      type="text"
                      disabled
                      placeholder={
                        s.session_chat_id === null ? "" : s.session_chat_id
                      }
                      onChange={() => {
                        handleChangeSessionChat(s.id);
                      }}
                    />
                  </td>
                  <td>
                    <select disabled id={`inputSubjectID_${s.id}`}>
                      <option defaultValue={s.subject_id} value={s.subject_id}>
                        {s.subject.name}
                      </option>
                      {subjectEdit.map((s) => (
                        <option key={s.id} value={s.id}>
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
                        showEditOptionSession(e, s);
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
              );
            })}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
