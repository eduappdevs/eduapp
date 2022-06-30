import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as TUITIONSSERVICE from "../services/enrollConfig.service";
import * as USERSSERVICE from "../services/user.service";
import * as COURSESERVICE from "../services/course.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import PageSelect from "./pagination/PageSelect";

export default function EnrollConfig(props) {
  const [tuitions, setTuitions] = useState(null);
  const [users, setUsers] = useState(null);
  const [courses, setCourses] = useState(null);

  const [search, setSearch] = useState("");
  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState();

  const [courseEdit, setCourseEdit] = useState([]);
  const [emailEdit, setEmailEdit] = useState([]);

  const [newEmail] = useState();
  const [newCourse] = useState();
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeCourse, setChangeCourse] = useState(false);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  let enrollment_filter = {};

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "101%";
      document.getElementById("standard-modal").style.height = "101%";
      document.getElementById("controlPanelContentContainer").style.overflow =
        "hidden";
    }
  };
  const finalizedEdit = (type, icon, text, confirmDel) => {
    fetchTuitions(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  };

  const finalizedCreate = (type, icon, txt, confirmDel) => {
    fetchTuitions(actualPage);
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
    fetchTuitions(actualPage);
  };

  const connectionAlert = async () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(props.language.connectionAlert);
    setPopupIcon("error");
  };

  const fetchTuitions = (pages) => {
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.pagedTuitions(pages)
        .then((ts) => {
          setActualPage(ts.data.page);
          setTuitions(ts.data.current_page);
          setMaxPages(ts.data.total_pages);
          enrollment_filter.enroll = ts.data.current_page;
        })
        .catch(async (err) => {
          interceptExpiredToken(err);
        });
    }).then(async (e) => {
      if (e) {
        connectionAlert();
        await interceptExpiredToken(e);
      }
    });
  };

  const enrollFilter = (EnrollList) => {
    let filterEnroll = [];
    EnrollList.map((s) => {
      if (
        s.course_id ===
        (enrollment_filter.filter === -1
          ? s.course_id
          : parseInt(enrollment_filter.filter))
      )
        filterEnroll.push(s);
      return true;
    });
    setTuitions(filterEnroll);
  };

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USERSSERVICE.fetchUserInfos().then((us) => {
        setUsers(us.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchCourses = () => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.fetchCourses().then((cs) => {
        setCourses(cs.data);
        enrollment_filter.couses = cs.data;
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchAll = () => {
    fetchCourses();
    fetchTuitions(1);
    fetchUsers();

    document.addEventListener("filter_subject_enroll", (e) => {
      e.stopImmediatePropagation();
      enrollment_filter.filter =
        e.detail === props.language.chooseCourse ? -1 : e.detail.split("_")[0];
      enrollFilter(enrollment_filter.enroll);
    });
  };

  const createTuition = (e) => {
    e.preventDefault();
    switchEditState(false);

    let user = document.getElementById("user_select").value;
    let course = document.getElementById("course_select").value;

    let valid = true;
    if (user === "-" && course === "-") valid = false;

    if (valid) {
      API.asynchronizeRequest(function () {
        const payload = new FormData();
        payload.append("course_id", course);
        payload.append("user_id", user);
        TUITIONSSERVICE.createTuition(payload)
          .then((e) => {
            if (e) {
              fetchAll();
              setPopup(true);
              setPopupType("info");
              setPopupText(props.language.creationCompleted);
            }
          })
          .catch((e) => {
            if (e) {
              interceptExpiredToken(e);
              setPopup(true);
              setPopupType("info");
              setPopupText(props.language.creationAlert);
            }
          });
      }).then(async (e) => {
        if (e) {
          await interceptExpiredToken(e);
          connectionAlert();
        }
      });
    } else {
      alertCreate();
    }
  };

  const alertCreate = async () => {
    setPopupText(props.language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const deleteTuition = (id) => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.deleteTuition(id)
        .then((e) => {
          if (e) {
            finalizedDelete(
              "info",
              true,
              false,
              props.language.deleteAlertCompleted
            );
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedDelete(
              "error",
              true,
              false,
              props.language.deleteAlertFailed
            );
            await interceptExpiredToken(e);
          }
        });
    }).then(async (e) => {
      if (e) {
        connectionAlert();
        await interceptExpiredToken(e);
      }
    });
  };

  const confirmDeleteEvent = async (id) => {
    switchEditState(false);
    finalizedDelete("warning", true, true, props.language.deleteAlert);
    setIdDelete(id);
  };

  const showEditOptionSession = (e) => {
    e.target.parentNode.parentNode.childNodes[1].childNodes[0].disabled = false;
    listCourse(
      e.target.parentNode.parentNode.childNodes[1].childNodes[0].value
    );
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

  const editEnroll = (e, s) => {
    switchEditState(false);
    let course = e.target.parentNode.parentNode.childNodes[1].childNodes[0];

    let inputCourse = document.getElementById("inputCourse_" + s.id).value;

    let editCourse;

    if (inputCourse !== "" && inputCourse !== s.session_start_date) {
      editCourse = inputCourse;
    } else {
      editCourse = s.session_start_date;
    }

    console.log(s, editCourse);
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.editTuition({
        id: s.id,
        course_id: editCourse,
        user_id: s.user.id,
      })
        .then((error) => {
          if (error) {
            let num = 0;
            while (num < 4) {
              e.target.parentNode.childNodes[num].style.display === "block"
                ? (e.target.parentNode.childNodes[num].style.display = "none")
                : (e.target.parentNode.childNodes[num].style.display = "block");
              num += 1;
            }
            course.disabled = true;
            finalizedEdit(
              "info",
              true,
              props.language.editAlertCompleted,
              false
            );
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedEdit("error", true, props.language.editAlertFailed, false);
            await interceptExpiredToken(e);
          }
        });
    }).then(async (e) => {
      if (e) {
        alertCreate();
        await interceptExpiredToken(e);
      }
    });
  };

  const closeEditSession = (e, s) => {
    e.target.parentNode.parentNode.childNodes[1].childNodes[0].disabled = true;

    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const listCourse = (course) => {
    let list = [];
    courses.map((c) => {
      if (c.id !== course) {
        list.push(c);
      }
      return true;
    });
    setCourseEdit(list);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    setSearch(props.search);
  }, [props.search]);

  useEffect(() => {}, [props.language]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table>
          <thead>
            <tr>
              <th>{props.language.add}</th>
              <th>{props.language.user}</th>
              <th>{props.language.course}</th>
            </tr>
          </thead>
          <tbody>
            <tr key={"newTuition"}>
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button onClick={createTuition}>
                  <svg
                    xmlns="http://www.w3.org/2000/ svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                    id="add-svg"
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
                  <div id="submit-loader" className="loader">
                    {props.language.loading} ...
                  </div>
                </button>
              </td>
              <td>
                <select defaultValue={"-"} id="user_select">
                  <option value="-">{props.language.chooseUser}</option>
                  {users
                    ? users.map((u) => {
                        return (
                          <option key={u.id} value={u.user.id}>
                            {u.user.email}
                          </option>
                        );
                      })
                    : null}
                </select>
              </td>
              <td>
                <select defaultValue={"-"} id="course_select">
                  <option value="-">{props.language.chooseCourse}</option>
                  {courses
                    ? courses.map((c) => {
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        );
                      })
                    : null}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        {tuitions && tuitions.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchTuitions(p)}
                maxPages={maxPages}
              />
            </div>
            <div className="subjects-table-info">
              <table style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>{props.language.user}</th>
                    <th>{props.language.course}</th>
                    <th>{props.language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {tuitions.map((t) => {
                    if (search.length > 0) {
                      if (
                        t.user.email
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ) {
                        return (
                          <tr key={t.id}>
                            <td>
                              <input
                                type="text"
                                disabled
                                value={t.user.email}
                              />
                            </td>
                            <td>
                              <select id={`inputCourse_${t.id}`} disabled>
                                <option
                                  defaultValue={t.course_id}
                                  value={t.course_id}
                                >
                                  {t.course.name}
                                </option>
                                {courseEdit.map((c) => {
                                  console.log(c);
                                  return (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  );
                                })}
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
                                  confirmDeleteEvent(t.id);
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
                                  showEditOptionSession(e, t);
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
                                  editEnroll(e, t);
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
                                  closeEditSession(e, t);
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
                        <tr key={t.id}>
                          <td>
                            <input type="text" disabled value={t.user.email} />
                          </td>
                          <td>
                            <select id={`inputCourse_${t.id}`} disabled>
                              <option
                                defaultValue={t.course_id}
                                value={t.course_id}
                              >
                                {t.course.name}
                              </option>
                              {courseEdit.map((c) => {
                                return (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                );
                              })}
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
                                confirmDeleteEvent(t.id);
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
                                showEditOptionSession(e, t);
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
                                editEnroll(e, t);
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
                                closeEditSession(e, t);
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
      </div>
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setPopup(false);
          deleteTuition(idDelete);
        }}
        onNoAction={() => {
          setPopup(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
