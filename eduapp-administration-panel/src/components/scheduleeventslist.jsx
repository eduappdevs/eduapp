import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as SCHEDULESERVICE from "../services/schedule.service";
import * as USER_SERVICE from "../services/user.service";
import Input from "./Input";
import { getOfflineUser, interceptExpiredToken } from "../utils/OfflineManager";
import StandardModal from "./modals/standard-modal/StandardModal";
import PageSelect from "./pagination/PageSelect";
import "../styles/scheduleeventslist.css";

export default function Scheduleeventslist(props) {
  const [subject, setSubject] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [isPop, setIsPop] = useState(false);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState();

  const [newStartDate] = useState();
  const [newEndDate] = useState();
  const [newName] = useState();
  const [newDescription] = useState();
  const [newIsPop] = useState();

  const [changeEndDate, setChangeEndDate] = useState(false);
  const [changeStartDate, setChangeStartDate] = useState(false);
  const [changeName, setChangeName] = useState(false);
  const [changeDescription, setChangeDescription] = useState(false);
  const [changeIsPop, setChangeIsPop] = useState(false);
  const [subjectEdit, setSubjectEdit] = useState([]);
  const [search, setSearch] = useState("");

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  let events_filter = {};

  const shortUUID = (uuid) => uuid.substring(0, 8);

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "101%";
      document.getElementById("standard-modal").style.height = "101%";
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "hidden";
    }
  };

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(props.language.connectionAlert);
    setPopupIcon("error");
  };

  const finalizedEdit = (type, icon, text, confirmDel) => {
    fetchEvents(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  };

  const finalizedCreate = (type, icon, txt, confirmDel) => {
    fetchEvents(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(txt);
  };

  const finalizedDelete = (type, icon, confirmDel, text) => {
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchEvents(actualPage);
  };

  const fetchSubjects = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubject()
        .then((res) => {
          setSubject(res.data);
        })
        .catch(async (e) => {
          await interceptExpiredToken(e);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USER_SERVICE.fetchUserInfos().then((res) => {
        setUsers(res.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchEvents = async (pages) => {
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.pagedEvents(pages).then((event) => {
        setMaxPages(event.data.total_pages);
        setActualPage(event.data.page);
        setEvents(event.data.current_page);
        fetchSubjects();
        fetchUsers();
        events_filter.events = event.data.current_page;
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const listSubject = (sub) => {
    let list_subject = [];
    subject.map((s) => {
      if (s.id !== sub.split("_")[0]) {
        list_subject.push(s);
      }
      return true;
    });
    setSubjectEdit(list_subject);
  };

  const AddNewEvent = async (e) => {
    e.preventDefault();
    switchEditState(false);

    const context = [
      "annotation_title",
      "annotation_description",
      "annotation_start_date",
      "annotation_end_date",
      "isGlobal",
      "isPop",
      "user_id",
      "subject_id",
    ];

    let json = [];
    let name = document.getElementById("e_title").value;
    let description = document.getElementById("e_description").value;
    let start_date = document.getElementById("e_start_date").value;
    let end_date = document.getElementById("e_end_date").value;
    let subject = !isGlobal
      ? document.getElementById("e_subjectId").value
      : (await SUBJECTSERVICE.getGeneralSubject()).data[0].id;
    let author = getOfflineUser().user.id;
    if (
      name !== "" &&
      start_date !== "" &&
      end_date !== "" &&
      subject !== props.language.chooseSubject
    ) {
      json.push(
        name,
        description,
        start_date,
        end_date,
        isGlobal,
        isPop,
        author,
        subject
      );
    } else {
      finalizedCreate("error", true, props.language.creationFailed, false);
      return;
    }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }

    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.createEvent(eventJson)
        .then((e) => {
          if (e) {
            finalizedCreate(
              "info",
              true,
              props.language.creationCompleted,
              false
            );
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedCreate(
              "error",
              true,
              props.language.creationFailed,
              false
            );
            await interceptExpiredToken(e);
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const isGlobalEvent = () => {
    setIsGlobal(document.getElementById("e_isGlobal").checked);
  };

  const isPopEvent = () => {
    setIsPop(document.getElementById("e_isPop").checked);
  };

  const confirmDeleteEvent = async (e) => {
    switchEditState(false);
    finalizedDelete("warning", true, true, props.language.deleteAlert);
    setIdDelete(e);
  };

  const deleteEvent = async (e) => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.deleteEvent(e.id)
        .then((x) => {
          if (x) {
            finalizedDelete(
              "info",
              true,
              false,
              props.language.deleteAlertCompleted
            );
          }
        })
        .catch(async (error) => {
          if (error) {
            finalizedDelete(
              "error",
              true,
              false,
              props.language.deleteAlertFailed
            );
            await interceptExpiredToken(error);
          }
        });
    }).then(async (error) => {
      if (error) {
        connectionAlert();
        await interceptExpiredToken(error);
      }
    });
  };
  const editEvent = (e, s) => {
    switchEditState(false);
    let inputName = document.getElementById("inputName_" + s.id).value;
    let inputStartDate = document.getElementById(
      "inputStartDate_" + s.id
    ).value;
    let inputEndDate = document.getElementById("inputEndDate_" + s.id).value;
    let inputDescription = document.getElementById(
      "inputDescription_" + s.id
    ).value;

    let editTitle,
      editStartDate,
      editEndDate,
      editDescription,
      editSubject,
      editIsGlobal,
      editIsPop;

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

    if (subject !== undefined && subject !== null) {
      let inputSubject = document.getElementById(
        "inputSubjectID_" + s.id
      ).value;

      if (inputSubject.split("_")[0] !== s.subject_id) {
        editSubject = inputSubject.split("_")[0];
      } else {
        editSubject = s.subject_id;
      }
      let inputPop = document.getElementById("inputIsPop_" + s.id).checked;
      if (inputSubject.split("_")[1] !== "GEN") {
        editIsGlobal = false;
        editIsPop = false;
      } else {
        editIsGlobal = true;
        editIsPop = inputPop;
      }
    }
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.editEvent({
        id: s.id,
        annotation_start_date: editStartDate,
        annotation_end_date: editEndDate,
        annotation_title: editTitle,
        annotation_description: editDescription,
        isGlobal: editIsGlobal,
        isPop: editIsPop,
        user_id: s.user.id,
        subject_id: editSubject,
      })
        .then((c) => {
          if (c) {
            finalizedEdit(
              "info",
              true,
              props.language.editAlertCompleted,
              false
            );
            let num = 0;
            while (num < 4) {
              e.target.parentNode.childNodes[num].style.display === "block"
                ? (e.target.parentNode.childNodes[num].style.display = "none")
                : (e.target.parentNode.childNodes[num].style.display = "block");
              num += 1;
            }
            let disable = 1;
            while (disable < 9) {
              if (disable !== 3 && disable !== 6) {
                e.target.parentNode.parentNode.childNodes[
                  disable
                ].childNodes[0].disabled = true;
              }
              disable += 1;
            }
          }
        })
        .catch(async (error) => {
          if (error) {
            finalizedEdit("error", true, props.language.editAlertFailed, false);
            await interceptExpiredToken(error);
          }
        });
    }).catch(async (error) => {
      if (error) {
        connectionAlert();
        await interceptExpiredToken(e);
      }
    });
  };

  const closeEditEvent = (e, s) => {
    let disable = 1;
    while (disable < 9) {
      if (disable !== 3 && disable !== 6) {
        e.target.parentNode.parentNode.childNodes[
          disable
        ].childNodes[0].disabled = true;
      }
      disable += 1;
    }
    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const showEditOptionEvent = (e) => {
    let disable = 1;
    while (disable < 9) {
      if (disable !== 3 && disable !== 6) {
        if (disable === 8) {
          listSubject(
            e.target.parentNode.parentNode.childNodes[disable - 1].childNodes[0]
              .value
          );
          if (
            e.target.parentNode.parentNode.childNodes[
              disable - 1
            ].childNodes[0].value.split("_")[1] === "GEN"
          ) {
            e.target.parentNode.parentNode.childNodes[
              disable
            ].childNodes[0].disabled = false;
          }
        } else {
          e.target.parentNode.parentNode.childNodes[
            disable
          ].childNodes[0].disabled = false;
        }
      }

      disable += 1;
    }
    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === ""
        ? e.target.parentNode.childNodes[num].style.display === "none"
          ? (e.target.parentNode.childNodes[num].style.display = "block")
          : (e.target.parentNode.childNodes[num].style.display = "none")
        : e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const handleChangeName = (id) => {
    setChangeName(true);
    return document.getElementById(`inputName_${id}`).value;
  };

  const handleChangeEndDate = (id) => {
    setChangeEndDate(true);
    return document.getElementById("inputEndDate_" + id).value;
  };

  const handleChangeStartDate = (id) => {
    setChangeStartDate(true);
    return document.getElementById("inputStartDate_" + id).value;
  };

  const handleChangeDescription = (id) => {
    setChangeDescription(true);
    return document.getElementById(`inputDescription_${id}`);
  };

  const handleChangeIsPop = (id, value) => {
    setChangeIsPop(true);
    return (document.getElementById(`inputIsPop_${id}`).checked = value);
  };

  const sessionFilterEvent = (sessionList) => {
    let filterSessions = [];
    sessionList.map((s) => {
      if (
        s.subject_id ===
        (events_filter.filter === -1
          ? s.subject_id
          : parseInt(events_filter.filter))
      )
        filterSessions.push(s);
      return true;
    });
    setEvents(filterSessions);
  };

  useEffect(() => {
    fetchSubjects();
    fetchEvents(1);
    fetchUsers();
    setSearch();

    document.addEventListener("filter_subject_event", (e) => {
      e.stopImmediatePropagation();
      events_filter.filter =
        e.detail === props.language.chooseSubject ? -1 : e.detail.split("_")[0];

      sessionFilterEvent(events_filter.events);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSearch(props.search);
  }, [props.search]);

  return (
    <>
      <div className="scheduleeventslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{props.language.title}</th>
              <th>{props.language.description}</th>
              <th>{props.language.startDate}</th>
              <th>{props.language.endDate}</th>
              <th>{props.language.isGlobal}</th>
              {isGlobal ? (
                <th>{props.language.isPop}</th>
              ) : (
                <th>{props.language.subjects}</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button onClick={AddNewEvent}>
                  <svg
                    id="add-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                  <svg
                    id="commit-loader-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    className="bi bi-arrow-repeat commit-loader-hide loader-spin"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path
                      fillRule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                    />
                  </svg>
                </button>
              </td>
              <td>
                <Input
                  id="e_title"
                  type="text"
                  placeholder={props.language.title}
                  className={"e_title"}
                />
              </td>
              <td>
                <Input
                  id="e_description"
                  type="text"
                  placeholder={props.language.description}
                  className={"e_description"}
                />
              </td>
              <td>
                <input
                  id="e_start_date"
                  type="datetime-local"
                  placeholder={props.language.startDate}
                />
              </td>
              <td>
                <input
                  id="e_end_date"
                  type="datetime-local"
                  placeholder={props.language.endDate}
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
                <td style={{ textAlign: "center" }}>
                  <input id="e_isPop" type="checkbox" onClick={isPopEvent} />
                </td>
              ) : (
                <td className="subjecButton">
                  <select id="e_subjectId">
                    <option defaultValue="Choose subject">
                      {props.language.chooseSubject}
                    </option>
                    {subject.map((s) => {
                      if (s.name !== "General") {
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </select>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {events && events.length !== 0 ? (
        <>
          <div className="notify-users">
            <PageSelect
              onPageChange={async (p) => fetchEvents(p)}
              maxPages={maxPages}
            />
          </div>
          <div className="schedule-table-info">
            <table className="eventList" style={{ marginTop: "15px" }}>
              <thead>
                <tr>
                  <th>{props.language.code}</th>
                  <th>{props.language.title}</th>
                  <th>{props.language.description}</th>
                  <th>{props.language.author}</th>
                  <th>{props.language.startDate}</th>
                  <th>{props.language.endDate}</th>
                  <th>{props.language.isGlobal}</th>
                  <th>{props.language.subjects}</th>
                  <th>{props.language.isPop}</th>
                  <th>{props.language.actions}</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => {
                  if (search.length > 0) {
                    if (
                      e.annotation_title
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      e.user.email.toLowerCase().includes(search.toLowerCase())
                    ) {
                      return (
                        <tr key={e.id}>
                          <td>{shortUUID(e.id)}</td>
                          <td>
                            <input
                              type="text"
                              id={`inputName_${e.id}`}
                              disabled
                              value={
                                changeName === false
                                  ? e.annotation_title
                                  : newName
                              }
                              onChange={() => {
                                handleChangeName(e.id);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={
                                changeDescription === false
                                  ? e.annotation_description
                                  : newDescription
                              }
                              disabled
                              id={`inputDescription_${e.id}`}
                              onChange={() => {
                                handleChangeDescription();
                              }}
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
                              onChange={() => {
                                handleChangeStartDate(e.id);
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
                              onChange={() => {
                                handleChangeEndDate(e.id);
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
                            <select id={`inputSubjectID_${e.id}`} disabled>
                              <option
                                defaultValue={
                                  e.subject.id + "_" + e.subject.subject_code
                                }
                                value={e.id + "_" + e.subject_code}
                              >
                                {e.subject.name}
                              </option>
                              {subjectEdit.map((s) => (
                                <option
                                  key={s.id}
                                  value={
                                    s.subject.id + "_" + s.subject.subject_code
                                  }
                                >
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              id={`inputIsPop_${e.id}`}
                              type="checkbox"
                              disabled
                              checked={
                                changeIsPop === false ? e.isPop : newIsPop
                              }
                              onChange={(ev) => {
                                handleChangeIsPop(e.id, ev.target.checked);
                              }}
                            />
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
                                confirmDeleteEvent(e);
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
                    }
                  } else {
                    return (
                      <tr key={e.id}>
                        <td>{shortUUID(e.id)}</td>
                        <td>
                          <input
                            type="text"
                            id={`inputName_${e.id}`}
                            disabled
                            value={
                              changeName === false
                                ? e.annotation_title
                                : newName
                            }
                            onChange={() => {
                              handleChangeName(e.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={
                              changeDescription === false
                                ? e.annotation_description
                                : newDescription
                            }
                            disabled
                            id={`inputDescription_${e.id}`}
                            onChange={() => {
                              handleChangeDescription();
                            }}
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
                            onChange={() => {
                              handleChangeStartDate(e.id);
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
                            onChange={() => {
                              handleChangeEndDate(e.id);
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
                          <select id={`inputSubjectID_${e.id}`} disabled>
                            <option
                              defaultValue={
                                e.subject.id + "_" + e.subject.subject_code
                              }
                              value={
                                e.subject.id + "_" + e.subject.subject_code
                              }
                            >
                              {e.subject.name}
                            </option>
                            {subjectEdit.map((s) => (
                              <option
                                key={s.id}
                                value={s.id + "_" + s.subject_code}
                              >
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input
                            id={`inputIsPop_${e.id}`}
                            type="checkbox"
                            disabled
                            checked={changeIsPop === false ? e.isPop : newIsPop}
                            onChange={(ev) => {
                              handleChangeIsPop(e.id, ev.target.checked);
                            }}
                          />
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
                              confirmDeleteEvent(e);
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
                  }
                  return true;
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setPopup(false);
          deleteEvent(idDelete);
          setIsConfirmDelete(false);
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
