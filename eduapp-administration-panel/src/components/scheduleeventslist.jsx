import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as SCHEDULESERVICE from "../services/schedule.service";
import * as USER_SERVICE from "../services/user.service";
import Input from "./Input";

import "../styles/scheduleeventslist.css";

export default function Scheduleeventslist(props) {
  const [subject, setSubject] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [search,setSearch] = useState('')


  const FetchSubjects = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubject().then((res) => {
        res.data.shift();
        setSubject(res.data);
      });
    });
  };

  const FetchUsers = () => {
    API.asynchronizeRequest(function () {
      USER_SERVICE.fetchUserInfos().then((res) => {
        setUsers(res.data);
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
    let author = document.getElementById("e_author").value;
    let description = document.getElementById("e_description").value;
    let start_date = document.getElementById("e_start_date").value;
    let end_date = document.getElementById("e_end_date").value;
    let subject = [];
    let subject_id = [];

    if (
      !isGlobal
        ? (subject = document.getElementById("e_subjectId").value)
        : console.log()
    )
      if (!isGlobal ? (subject_id = subject.split("_")[0]) : (subject_id = 1));

    if (
      name !== "" &&
      author !== "" &&
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
        author.split("_")[0],
        parseInt(subject_id)
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
          FetchEvents();
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  const FetchEvents = async () => {
    let eventValue = [];
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.fetchEvents().then((event) => {
        event.data.map((e) => {
          if (e.isGlobal) {
            let id = e.id;
            let startDate = e.annotation_start_date;
            let endDate = e.annotation_end_date;
            let title = e.annotation_title;
            let description = e.annotation_description;
            let subject = e.subject_id;
            let user = e.user_id;
            let isGlobal = e.isGlobal;
            let subject_name = e.subject.name;

            eventValue.push({
              id: id,
              startDate: startDate,
              endDate: endDate,
              title: title,
              description: description,
              subject: subject_name,
              subject_id: subject,
              user: user,
              isGlobal: isGlobal,
            });
          } else {
            let id = e.id;
            let startDate = e.annotation_start_date;
            let endDate = e.annotation_end_date;
            let title = e.annotation_title;
            let description = e.annotation_description;
            let subject = e.subject_id;
            let subject_name = e.subject.name;
            let user = e.user_id;
            let isGlobal = e.isGlobal;
            eventValue.push({
              id: id,
              startDate: startDate,
              endDate: endDate,
              title: title,
              description: description,
              subject: subject_name,
              subject_id: subject,
              user: user,
              isGlobal: isGlobal,
            });
          }
          return true;
        });
        setEvents(eventValue);
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
          FetchEvents();
        })
        .catch((e) => console.log(e));
    });
  };

  useEffect(() => {
    FetchSubjects();
    FetchEvents();
    setSearch("")
    FetchUsers();
  }, []);

  useEffect(()=>{
    setSearch(props.search)
  },[props.search])
    

  return (
    <>
      <div className="scheduleeventslist-main-container">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{props.language.title}</th>
              <th>{props.language.author}</th>
              <th>{props.language.description}</th>
              <th>{props.language.startDate}</th>
              <th>{props.language.endDate}</th>
              <th>{props.language.isGlobal}</th>
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
                <Input id="e_title" type="text" placeholder="Title" className={'e_title'}/>
              </td>
              <td>
                <select id="e_author">
                  <option defaultValue="--">{props.language.chooseAuthor}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id + "_" + u.user_name}>
                      {u.user.email}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <Input id="e_description" type="text" placeholder="Description" className={'e_description'}/>
              </td>
              <td>
                <Input id="e_startDate" type="datetime-local" placeholder="Start date" className={'e_startDate'}/>
              </td>
              <td>
                <Input id="e_endDate" type="datetime-local" placeholder="End date" className={'e_endDate'}/>
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
                      {props.language.chooseSubject}
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
              <th></th>
              <th>{props.language.title}</th>
              <th>{props.language.description}</th>
              <th>{props.language.startDate}</th>
              <th>{props.language.endDate}</th>
              <th>{props.language.isGlobal}</th>
              <th>{props.language.actions}</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              console.log(e, 'event')
              if(search.length > 0){
                if(e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())){
              return (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>{e.description}</td>
                  <td>{e.startDate}</td>
                  <td>{e.endDate}</td>
                  <td style={{ textAlign: "center" }}>
                    {e.isGlobal ? (
                      <input type="checkbox" disabled checked />
                    ) : (
                      <input type="checkbox" disabled />
                    )}
                  </td>
                  <td>{e.subject}</td>
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
                    }}
            else{
              return (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>{e.description}</td>
                  <td>{e.startDate}</td>
                  <td>{e.endDate}</td>
                  <td style={{ textAlign: "center" }}>
                    {e.isGlobal ? (
                      <input type="checkbox" disabled checked />
                    ) : (
                      <input type="checkbox" disabled />
                    )}
                  </td>
                  <td>{e.subject}</td>
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
              
              
            }})}
          </tbody>
        </table>
      ) : null}
    </>
  );
}
