import React, { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../API";
import * as SUBJECTSERVICE from "../Service/subject.service";
import * as SCHEDULESERVICE from "../Service/schedule.service";

import "../styles/scheduleeventslist.css";

export default function Scheduleeventslist() {
  const [subject, setSubject] = useState([]);
  const [events, setEvents] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const FetchSubjects = () => {
    API.asynchronizeRequest(function () {
      axios.get(SUBJECTSERVICE.SUBJECTS).then((res) => {
        res.data.shift();
        setSubject(res.data);
      });
    });
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
    let description = document.getElementById("e_description").value;
    let start_date = document.getElementById("e_start_date").value;
    let end_date = document.getElementById("e_end_date").value;
    let subject = [];
    let subject_id = [];
    let userId = localStorage.userId;
    if (
      !isGlobal
        ? (subject = document.getElementById("e_subjectId").value)
        : console.log()
    )
      console.log(subject);
    if (!isGlobal ? (subject_id = subject.split("_")[0]) : (subject_id = 1));
    if (
      name !== "" &&
      start_date !== "" &&
      end_date !== "" &&
      subject_id !== "Choose subject"
    ) {
      json.push(
        name,
        description,
        start_date,
        end_date,
        isGlobal,
        userId,
        parseInt(subject_id)
      );
    } else {
      console.log("error");
    }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }
    axios
      .post(SCHEDULESERVICE.EVENTS, eventJson)
      .then(() => {
        FetchEvents();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const FetchEvents = async () => {
    API.asynchronizeRequest(function () {
      let sheduleEvent = SCHEDULESERVICE.fetchSchedules;
      console.log(sheduleEvent);
    });
  };
  const isGlobalEvent = () => {
    let checkbox = document.getElementById("e_isGlobal").checked;
    setIsGlobal(checkbox);
  };
  const deleteEvent = (id) => {
    API.asynchronizeRequest(function () {
      axios
        .delete(`${SCHEDULESERVICE.EVENTS}/${id}`)
        .then(() => {
          FetchEvents();
        })
        .catch((e) => console.log(e));
    });
  };
  useEffect(() => {
    FetchSubjects();
    FetchEvents();
  }, []);
  return (
    <>
      <div className="scheduleeventslist-main-container">
        <table className="createTable">
          <thead>
            <tr>
              <th>Event</th>
              <th>Title</th>
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
                  autoComplete="off"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="e_description"
                  id="e_description"
                  placeholder="Description"
                  autoComplete="off"
                />
              </td>
              <td>
                <input
                  id="e_start_date"
                  type="datetime-local"
                  placeholder="Date"
                  autoComplete="off"
                />
              </td>
              <td>
                <input
                  id="e_end_date"
                  type="datetime-local"
                  placeholder="Date"
                  autoComplete="off"
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
                      <option key={s.id} value={s.id + "_" + s.name}>
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
              <th>Start date</th>
              <th>Start time</th>
              <th>Ending date</th>
              <th>Ending Time</th>
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
                  <td>{e.title}</td>
                  <td>{e.description}</td>
                  <td>{e.dayStart}</td>
                  <td>{e.hourStart}</td>
                  <td>{e.dayEnd}</td>
                  <td>{e.hourEnd}</td>
                  <td style={{ textAlign: "center" }}>
                    {e.isGlobal ? (
                      <input type="checkbox" disabled checked />
                    ) : (
                      <input type="checkbox" disabled />
                    )}
                  </td>
                  <td>{e.subject_name}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
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