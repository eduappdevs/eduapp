import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as SCHEDULESERVICE from "../services/schedule.service";
import * as USER_SERVICE from "../services/user.service";

import "../styles/scheduleeventslist.css";

export default function Scheduleeventslist() {
  const [subject, setSubject] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [newEndDate] = useState();
  const [newStartDate] = useState();
  const [changeEndDate, setChangeEndDate] = useState(false);
  const [changeStartDate, setChangeStartDate] = useState(false);
  const [subjectEdit, setSubjectEdit] = useState([]);

  const fetchSubjects = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubject().then((res) => {
        res.data.shift();
        setSubject(res.data);
      });
    });
  };

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USER_SERVICE.fetchUserInfos().then((res) => {
        setUsers(res.data);
      });
    });
  };

  const listSubject = (sub) => {
    let list_subject = [];
    subject.map((s) => {
      if (s.id !== parseInt(sub)) {
        list_subject.push(s);
      }
      return true;
    });
    setSubjectEdit(list_subject);
  };

  const AddNewEvent = async (e) => {
    e.preventDefault();

    const context = [
      "annotation_title",
      "annotation_description",
      "annotation_start_date",
      "annotation_end_date",
      "isGlobal",
      "user_id",
      "subject_id",
    ];

    let json = [];
    let name = document.getElementById("e_title").value;
    let author = document.getElementById("e_author").value;
    let description = document.getElementById("e_description").value;
    let start_date = document.getElementById("e_start_date").value;
    let end_date = document.getElementById("e_end_date").value;
    let subject = [];

    if (
      !isGlobal
        ? (subject = document.getElementById("e_subjectId").value)
        : subject.push(1)
    )
      if (
        name !== "" &&
        author !== "" &&
        start_date !== "" &&
        end_date !== "" &&
        subject !== "Choose subject"
      ) {
        json.push(
          name,
          description,
          start_date,
          end_date,
          isGlobal,
          author.split("_")[0],
          parseInt(subject)
        );
      } else {
        console.log("error");
      }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.createEvent(eventJson)
        .then(() => {
          fetchEvents();
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  const fetchEvents = async () => {
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.fetchEvents().then((event) => {
        setEvents(event.data);
      });
    });
  };

  const isGlobalEvent = () => {
    let checkbox = document.getElementById("e_isGlobal").checked;
    setIsGlobal(checkbox);
  };

  const deleteEvent = (id) => {
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.deleteEvent(id)
        .then(() => {
          fetchEvents();
        })
        .catch((e) => console.log(e));
    });
  };
  const editEvent = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      let inputName = document.getElementById("inputName_" + s.id).value;
      let inputStartDate = document.getElementById(
        "inputStartDate_" + s.id
      ).value;
      let inputEndDate = document.getElementById("inputEndDate_" + s.id).value;
      let inputDescription = document.getElementById(
        "inputDescription_" + s.id
      ).value;

      let editTitle, editStartDate, editEndDate, editDescription, editSubject;

      if (inputName !== "" && inputName !== s.annotation_title) {
        editTitle = inputName;
      } else {
        editTitle = s.annotation_title;
      }

      if (inputStartDate !== "" && inputStartDate !== s.annotation_start_date) {
        editStartDate = inputStartDate;
      } else {
        editStartDate = s.annotation_start_date;
      }

      if (inputEndDate !== "" && inputEndDate !== s.annotation_end_date) {
        editEndDate = inputEndDate;
      } else {
        editEndDate = s.annotation_end_date;
      }

      if (
        inputDescription !== "" &&
        inputDescription !== s.annotation_description
      ) {
        editDescription = inputDescription;
      } else {
        editDescription = s.annotation_description;
      }
      if (subject !== undefined) {
        let inputSubject = document.getElementById(
          "inputSubjectID_" + s.id
        ).value;
        if (inputSubject !== "" && inputSubject !== s.subject_id) {
          editSubject = inputSubject;
        } else {
          editSubject = s.subject_id;
        }
        parseInt(editSubject);
      } else {
        editSubject = s.subject_id;
      }

      API.asynchronizeRequest(function () {
        SCHEDULESERVICE.editEvent({
          id: s.id,
          annotation_start_date: editStartDate,
          annotation_end_date: editEndDate,
          annotation_title: editTitle,
          annotation_description: editDescription,
          isGlobal: s.isGlobal,
          user_id: s.user_id,
          subject_id: editSubject,
        })
          .then(() => {
            fetchEvents();
            fetchSubjects();
            let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
            buttonDelete.style.display = "block";
            let button = e.target.parentNode.parentNode.childNodes[1];
            button.style.display = "block";
            let checkButton = e.target.parentNode.parentNode.childNodes[2];
            checkButton.style.display = "none";
            let cancelButton = e.target.parentNode.parentNode.childNodes[3];
            cancelButton.style.display = "none";
            name.disabled = true;
            startDate.disabled = true;
            endDate.disabled = true;
            description.disabled = true;
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
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];

        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[5]
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
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;

        let editTitle, editStartDate, editEndDate, editDescription, editSubject;

        if (inputName !== "" && inputName !== s.annotation_title) {
          editTitle = inputName;
        } else {
          editTitle = s.annotation_title;
        }

        if (
          inputStartDate !== "" &&
          inputStartDate !== s.annotation_start_date
        ) {
          editStartDate = inputStartDate;
        } else {
          editStartDate = s.annotation_start_date;
        }

        if (inputEndDate !== "" && inputEndDate !== s.annotation_end_date) {
          editEndDate = inputEndDate;
        } else {
          editEndDate = s.annotation_end_date;
        }

        if (
          inputDescription !== "" &&
          inputDescription !== s.annotation_description
        ) {
          editDescription = inputDescription;
        } else {
          editDescription = s.annotation_description;
        }
        if (subject !== undefined) {
          let inputSubject = document.getElementById(
            "inputSubjectID_" + s.id
          ).value;
          if (inputSubject !== "" && inputSubject !== s.subject_id) {
            editSubject = inputSubject;
          } else {
            editSubject = s.subject_id;
          }
          parseInt(editSubject);
        } else {
          editSubject = s.subject_id;
        }

        API.asynchronizeRequest(function () {
          SCHEDULESERVICE.editEvent({
            id: s.id,
            annotation_start_date: editStartDate,
            annotation_end_date: editEndDate,
            annotation_title: editTitle,
            annotation_description: editDescription,
            isGlobal: s.isGlobal,
            user_id: s.user_id,
            subject_id: editSubject,
          })
            .then(() => {
              fetchEvents();
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
              description.disabled = true;
              subject.disabled = true;
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputStartDate = document.getElementById(
          "inputStartDate_" + s.id
        ).value;
        let inputEndDate = document.getElementById(
          "inputEndDate_" + s.id
        ).value;
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;

        let editTitle, editStartDate, editEndDate, editDescription, editSubject;

        if (inputName !== "" && inputName !== s.annotation_title) {
          editTitle = inputName;
        } else {
          editTitle = s.annotation_title;
        }

        if (
          inputStartDate !== "" &&
          inputStartDate !== s.annotation_start_date
        ) {
          editStartDate = inputStartDate;
        } else {
          editStartDate = s.annotation_start_date;
        }

        if (inputEndDate !== "" && inputEndDate !== s.annotation_end_date) {
          editEndDate = inputEndDate;
        } else {
          editEndDate = s.annotation_end_date;
        }

        if (
          inputDescription !== "" &&
          inputDescription !== s.annotation_description
        ) {
          editDescription = inputDescription;
        } else {
          editDescription = s.annotation_description;
        }
        if (subject !== undefined) {
          let inputSubject = document.getElementById(
            "inputSubjectID_" + s.id
          ).value;
          if (inputSubject !== "" && inputSubject !== s.subject_id) {
            editSubject = inputSubject;
          } else {
            editSubject = s.subject_id;
          }
          parseInt(editSubject);
        } else {
          editSubject = s.subject_id;
        }

        API.asynchronizeRequest(function () {
          SCHEDULESERVICE.editEvent({
            id: s.id,
            annotation_start_date: editStartDate,
            annotation_end_date: editEndDate,
            annotation_title: editTitle,
            annotation_description: editDescription,
            isGlobal: s.isGlobal,
            user_id: s.user_id,
            subject_id: editSubject,
          })
            .then(() => {
              fetchEvents();
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
              description.disabled = true;
              subject.disabled = true;
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    }
  };

  const closeEditEvent = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      if (subject !== undefined) {
        let content = document.getElementById(`inputSubjectID_${s.id}`).value;
        if (s.subject_id !== parseInt(content.value)) {
          content = s.subject_id;
        }
        subject.disabled = true;
      }
      name.disabled = true;
      startDate.disabled = true;
      endDate.disabled = true;
      description.disabled = true;
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
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[7].childNodes[0];

        if (subject !== undefined) {
          let content = document.getElementById(`inputSubjectID_${s.id}`).value;
          if (s.subject_id !== parseInt(content.value)) {
            content = s.subject_id;
          }
          subject.disabled = true;
        }

        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        description.disabled = true;
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
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];
        if (subject !== undefined) {
          let content = document.getElementById(`inputSubjectID_${s.id}`).value;
          if (s.subject_id !== parseInt(content.value)) {
            content = s.subject_id;
          }
          subject.disabled = true;
        }
        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        description.disabled = true;
        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "block";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "block";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "none";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "none";
      }
    }
  };

  const showEditOptionEvent = (e, S) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];

      if (subject !== undefined) {
        subject.disabled = false;
        listSubject(subject.value);
      }
      name.disabled = false;
      startDate.disabled = false;
      endDate.disabled = false;
      description.disabled = false;

      let buttonDelete = e.target.parentNode.parentNode.childNodes[1];
      buttonDelete.style.display = "none";
      let button = e.target.parentNode.parentNode.childNodes[0];
      button.style.display = "none";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "block";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "block";
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[6]
            .childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[7]
            .childNodes[0];

        if (subject !== undefined) {
          subject.disabled = false;
          listSubject(subject.value);
        }
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        description.disabled = false;

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
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];

        if (subject !== undefined) {
          subject.disabled = false;
          listSubject(subject.value);
        }
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        description.disabled = false;

        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "none";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "none";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "block";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "block";
      }
    }
  };

  const handleChangeName = (id) => {
    var content = document.getElementById("inputName_" + id);
    return content.value;
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

  useEffect(() => {
    fetchSubjects();
    fetchEvents();
    fetchUsers();
  }, []);

  return (
    <>
      <div className="scheduleeventslist-main-container">
        <table className="createTable">
          <thead>
            <tr>
              <th>Event</th>
              <th>Title</th>
              <th>Author</th>
              <th>Description</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Is Global</th>
              {isGlobal ? console.log() : <th>Subject</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button onClick={AddNewEvent}>
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
              </td>
              <td>
                <input
                  type="text"
                  name="e_title"
                  id="e_title"
                  placeholder="Title"
                />
              </td>
              <td>
                <select id="e_author">
                  <option defaultValue="--">Choose Author</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id + "_" + u.user_name}>
                      {u.user.email}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  name="e_description"
                  id="e_description"
                  placeholder="Description"
                />
              </td>
              <td>
                <input
                  id="e_start_date"
                  type="datetime-local"
                  placeholder="Date"
                />
              </td>
              <td>
                <input
                  id="e_end_date"
                  type="datetime-local"
                  placeholder="Date"
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  id="e_isGlobal"
                  type="checkbox"
                  onClick={isGlobalEvent}
                />
              </td>
              {isGlobal ? (
                console.log()
              ) : (
                <td className="subjecButton">
                  <select id="e_subjectId">
                    <option defaultValue="Choose subject">
                      Choose subject
                    </option>
                    {subject.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {events && events.length !== 0 ? (
        <table className="eventList" style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Title</th>
              <th>Description</th>
              <th>Author</th>
              <th>Start date</th>
              <th>Ending date</th>
              <th>Is Global</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              return (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>
                    <input
                      type="text"
                      id={`inputName_${e.id}`}
                      disabled
                      placeholder={e.annotation_title}
                      onChange={(event) => {
                        handleChangeName(event.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder={e.annotation_description}
                      disabled
                      id={`inputDescription_${e.id}`}
                    />
                  </td>
                  <td>
                    <input type="text" value={e.user.email} disabled />
                  </td>
                  <td>
                    <input
                      id={`inputStartDate_${e.id}`}
                      type="datetime-local"
                      value={
                        changeStartDate === false
                          ? e.annotation_start_date
                          : newStartDate
                      }
                      disabled
                      onChange={(event) => {
                        handleChangeStartDate(event, e.id);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      id={`inputEndDate_${e.id}`}
                      type="datetime-local"
                      value={
                        changeEndDate === false
                          ? e.annotation_end_date
                          : newEndDate
                      }
                      disabled
                      onChange={(e) => {
                        handleChangeEndDate(e, e.id);
                      }}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {e.isGlobal ? (
                      <input type="checkbox" disabled checked />
                    ) : (
                      <input type="checkbox" disabled />
                    )}
                  </td>
                  <td>
                    {e.isGlobal ? (
                      console.log()
                    ) : (
                      <select disabled id={`inputSubjectID_${e.id}`}>
                        <option
                          defaultValue={e.subject_id}
                          value={e.subject_id}
                        >
                          {e.subject.name}
                        </option>
                        {subjectEdit.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
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
                      onClick={() => {
                        deleteEvent(e.id);
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
                      onClick={(event) => {
                        showEditOptionEvent(event, e);
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
                        editEvent(event, e);
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
                      onClick={(ev) => {
                        closeEditEvent(ev, e);
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
    </>
  );
}
