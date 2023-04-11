/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useCallback, useContext, useEffect, useState, useMemo, useRef } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as SCHEDULESERVICE from "../services/schedule.service";
import * as USER_SERVICE from "../services/user.service";
import Input from "./Input";
import { getOfflineUser, interceptExpiredToken } from "../utils/OfflineManager";
import StandardModal from "./modals/standard-modal/StandardModal";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import PageSelect from "./pagination/PageSelect";
import useFilter from "../hooks/useFilter";
import { getEventFields } from "../constants/search_fields";
import "../styles/scheduleeventslist.css";
import { LoaderCtx } from "../hooks/LoaderContext";

export default function Scheduleeventslist() {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [language] = useContext(LanguageCtx);

  const [subjects, setSubjects] = useState([]);
  const [hasDoneInitialFetch, setInitialFetch] = useState(false);
  const [events, setEvents] = useState([]);
  const [, setUsers] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [isPop, setIsPop] = useState(false);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const [newIsPop] = useState();

  const [changeIsPop, setChangeIsPop] = useState(false);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const eventBeforeEditing = useRef(null);

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);

  // const filteredEvents = useFilter(
  //   events,
  //   null,
  //   SCHEDULESERVICE.filterEvents,
  //   getEventFields(language)
  // );

  const shortUUID = useCallback((uuid) => uuid.substring(0, 8), []);

  const switchEditState = useCallback((state) => {
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
  }, []);

  const connectionAlert = useCallback(() => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  }, []);

  const finalizedEdit = useCallback((type, icon, text, confirmDel) => {
    fetchEvents(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  }, []);

  const finalizedCreate = useCallback((type, icon, txt, confirmDel) => {
    fetchEvents(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(txt);
  }, []);

  const finalizedDelete = useCallback((type, icon, confirmDel, text) => {
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchEvents(actualPage);
  }, []);

  const fetchSubjects = useCallback(() => {
    API.asynchronizeRequest(function () {
      // setLoadingParams({ loading: true });
      SUBJECTSERVICE.fetchSubjects()
        .then((res) => {
          setSubjects(res.data);
          // setLoadingParams({ loading: false });
        })
        .catch(async (e) => {
          await interceptExpiredToken(e);
          // setLoadingParams({ loading: false });
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const fetchUsers = useCallback(() => {
    API.asynchronizeRequest(function () {
      // setLoadingParams({ loading: true });
      USER_SERVICE.fetchUserInfos().then((res) => {
        setUsers(res.data);
        // setLoadingParams({ loading: false });
      }).catch(() => {
        // setLoadingParams({ loading: false });
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const fetchEvents = useCallback(async (page, order = null, searchParams) => {
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.pagedEvents(page, order, searchParams).then((event) => {
        setMaxPages(event.data.total_pages);
        setActualPage(event.data.page);
        setEvents(event.data.current_page);
        fetchSubjects();
        fetchUsers();
        setLoadingParams({ loading: false });
      }).catch(() => {
        setLoadingParams({ loading: false });
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    })
  }, []);

  const AddNewEvent = useCallback(async (e) => {
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
      subject !== language.chooseSubject
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
      finalizedCreate("error", true, language.creationFailed, false);
      return;
    }

    let eventJson = {};
    for (let i = 0; i < context.length; i++) {
      eventJson[context[i]] = json[i];
    }

    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.createEvent(eventJson)
        .then((e) => {
          if (e) {
            finalizedCreate("info", true, language.creationCompleted, false);
          }
          setLoadingParams({ loading: false });
        })
        .catch(async (e) => {
          if (e) {
            finalizedCreate("error", true, language.creationFailed, false);
            await interceptExpiredToken(e);
          }
          setLoadingParams({ loading: false });
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, [isGlobal, isPop]);

  const isGlobalEvent = useCallback(() => {
    setIsGlobal(document.getElementById("e_isGlobal").checked);
  }, []);

  const isPopEvent = useCallback(() => {
    setIsPop(document.getElementById("e_isPop").checked);
  }, []);

  const confirmDeleteEvent = useCallback(async (e) => {
    switchEditState(false);
    finalizedDelete("warning", true, true, language.deleteAlert);
    setIdDelete(e);
  }, []);

  const deleteEvent = useCallback(async (e) => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.deleteEvent(e.id)
        .then((x) => {
          if (x) {
            finalizedDelete("info", true, false, language.deleteAlertCompleted);
          }
          setLoadingParams({ loading: false });
        })
        .catch(async (error) => {
          if (error) {
            finalizedDelete("error", true, false, language.deleteAlertFailed);
            await interceptExpiredToken(error);
          }
          setLoadingParams({ loading: false });
        });
    }).then(async (error) => {
      if (error) {
        connectionAlert();
        await interceptExpiredToken(error);
      }
    });
  }, []);

  const editEvent = useCallback(async (e, s) => {
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

    if (subjects !== undefined && subjects !== null) {
      let inputSubject = document.getElementById(
        "inputSubjectID_" + s.id
      ).value;

      editIsGlobal = document.getElementById("inputIsGlobal_" + s.id).checked;
      editIsPop = document.getElementById("inputIsPop_" + s.id).checked;

      if (inputSubject.split("_")[0] !== s.subject_id) {
        editSubject = !editIsGlobal
        ? inputSubject.split("_")[0]
        : (await SUBJECTSERVICE.getGeneralSubject()).data[0].id;
      } else {
        editSubject = s.subject_id;
      }
    }

    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
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
            finalizedEdit("info", true, language.editAlertCompleted, false);
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
                e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
              }
              disable += 1;
            }
          }
          setLoadingParams({ loading: false });
        })
        .catch(async (error) => {
          if (error) {
            finalizedEdit("error", true, language.editAlertFailed, false);
            await interceptExpiredToken(error);
          }
          setLoadingParams({ loading: false });
        });
    }).catch(async (error) => {
      if (error) {
        connectionAlert();
        await interceptExpiredToken(e);
      }
    });
  }, []);

  const closeEditEvent = (e, index) => {
    let disable = 1;
    while (disable < 9) {
      // Not editing IsGlobal and IsEventNotification
      if (disable !== 3 && disable !== 6) {
        e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
      }
      disable += 1;
    }

    let auxEvents = [...events];
    auxEvents[index] = { ...eventBeforeEditing.current };
    setEvents(auxEvents);

    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const showEditOptionEvent = (e, index) => {
    let disable = 1;
    while (disable < 9) {
      if (disable !== 3) {
        e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = false;
      }
      disable += 1;
    }
    eventBeforeEditing.current = { ...events[index] };

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

  const handleChangeIsPop = useCallback((id, value) => {
    setChangeIsPop(true);
    return (document.getElementById(`inputIsPop_${id}`).checked = value);
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchEvents(1);
    fetchUsers();
    setInitialFetch(true);
  }, []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getEventFields(language),
      selectedField: getEventFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  useEffect(() => {
    if (hasDoneInitialFetch) {
      fetchEvents(actualPage, {
        field: searchParams.selectedField,
        order: searchParams.order,
      }, searchParams);
    }
  }, [searchParams, actualPage]);

  const handleChange = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    const newEvents = [...events];
    newEvents[index][inputName] = newValue;
    setEvents(newEvents);
  }
  const handleCheckChange = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.checked
    const newEvents = [...events];
    newEvents[index][inputName] = newValue;
    setEvents(newEvents);
  }

  const handleChangeSubject = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    subjects.forEach(s => {
      if (s.id === newValue) {
        const newEvents = [...events];
        newEvents[index][inputName] = s;
        setEvents(newEvents);
      }
    })
  }

  const memoizedEvents = () => {
    return (
      <>
        {events && events.map((e, index) => {
          return (
            <tr key={e.id}>
              <td>{shortUUID(e.id)}</td>
              <td>
                <input
                  id={`inputName_${e.id}`}
                  name="annotation_title"
                  disabled
                  type="text"
                  value={e.annotation_title}
                  onChange={(ev) => handleChange(index, ev)}
                />
              </td>
              <td>
                <input
                  id={`inputDescription_${e.id}`}
                  name="annotation_description"
                  disabled
                  type="text"
                  value={e.annotation_description}
                  onChange={(ev) => handleChange(index, ev)}
                />
              </td>
              <td>
                <input type="text" value={e.user.email} disabled />
              </td>
              <td>
                <input
                  id={`inputStartDate_${e.id}`}
                  name="annotation_start_date"
                  disabled
                  type="datetime-local"
                  value={e.annotation_start_date}
                  onChange={(ev) => handleChange(index, ev)}
                />
              </td>
              <td>
                <input
                  id={`inputEndDate_${e.id}`}
                  name="annotation_end_date"
                  disabled
                  type="datetime-local"
                  value={e.annotation_end_date}
                  onChange={(ev) => handleChange(index, ev)}
                />
              </td>
              <td style={{ textAlign: "center" }}>

                <input
                  id={`inputIsGlobal_${e.id}`}
                  name="isGlobal"
                  type="checkbox"
                  disabled
                  checked={e.isGlobal}
                  onChange={(ev) => handleCheckChange(index, ev)}
                  />
              </td>
              <td>
                <select id={`inputSubjectID_${e.id}`} disabled
                  name="subject"
                  onChange={(ev) => handleChangeSubject(index, ev)}>
                  {subjects.map((thisSubject) => {
                    if (e.subject.id == thisSubject.id) {
                      return (
                        <option key={thisSubject.id} value={thisSubject.id} selected>
                          {thisSubject.name}
                        </option>
                      )
                    }
                    return (<option key={thisSubject.id} value={thisSubject.id}>
                      {thisSubject.name}
                    </option>
                    )
                  })}
                </select>
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  id={`inputIsPop_${e.id}`}
                  name="isPop"
                  type="checkbox"
                  disabled
                  checked={e.isPop}
                  onChange={(ev) => handleCheckChange(index, ev)}
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
                  onClick={(e) => showEditOptionEvent(e, index)}
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
                  onClick={(ev) => {
                    editEvent(ev, e);
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
                  onClick={(e) => closeEditEvent(e, index)}
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
            </tr >
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="add-form">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{language.title}</th>
              <th>{language.description}</th>
              <th>{language.startDate}</th>
              <th>{language.endDate}</th>
              <th>{language.isGlobal}</th>
              {isGlobal ? null : (
                <th>{language.subjects}</th>
              )}
              <th>{language.isPop}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{language.add}:</th>
              <td>
                <Input
                  id="e_title"
                  type="text"
                  placeholder={language.title}
                  className={"e_title"}
                />
              </td>
              <td>
                <Input
                  id="e_description"
                  type="text"
                  placeholder={language.description}
                  className={"e_description"}
                />
              </td>
              <td>
                <input
                  id="e_start_date"
                  type="datetime-local"
                  placeholder={language.startDate}
                />
              </td>
              <td>
                <input
                  id="e_end_date"
                  type="datetime-local"
                  placeholder={language.endDate}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  id="e_isGlobal"
                  type="checkbox"
                  onClick={isGlobalEvent}
                />
              </td>
              {isGlobal ? null : (
                <td className="subjecButton">
                  <select id="e_subjectId">
                    <option defaultValue="Choose subject">
                      {language.chooseSubject}
                    </option>
                    {subjects.map((s) => {
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
              <td style={{ textAlign: "center" }}>
                <input id="e_isPop" type="checkbox" onClick={isPopEvent} />
              </td>
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
            </tr>
          </tbody>
        </table>
      </div>
      <div className="notify-users">
        <PageSelect
          onPageChange={(p) => setActualPage(p)}
          maxPages={maxPages}
        />
      </div>
      <div className="list-main-container" id="scroll">
        {events && events.length !== 0 ? (
          <div className="table-info">
            <table className="eventList" style={{ marginTop: "15px" }}>
              <thead>
                <tr>
                  <th>{language.code}</th>
                  <th>{language.title}</th>
                  <th>{language.description}</th>
                  <th>{language.author}</th>
                  <th>{language.startDate}</th>
                  <th>{language.endDate}</th>
                  <th>{language.isGlobal}</th>
                  <th>{language.subjects}</th>
                  <th>{language.isPop}</th>
                  <th>{language.actions}</th>
                </tr>
              </thead>
              <tbody>
                {memoizedEvents()}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
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
