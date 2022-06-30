import React, { useEffect, useState } from "react";
import * as API from "../API";
import { interceptExpiredToken } from "../utils/OfflineManager";
import * as INSTITUTIONSERVICES from "../services/institution.service";
import * as COURSESERVICE from "../services/course.service";
import * as SUBJECTSERVICE from "../services/subject.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import PageSelect from "./pagination/PageSelect";
import "../styles/courseConfig.css";

export default function CourseConfig(props) {
  const [courses, setCourses] = useState(null);
  const [institutions, setInstitutions] = useState([]);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState();
  const [search, setSearch] = useState("");

  const [changeName, setChangeName] = useState(false);
  const [newName] = useState();

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const shortUUID = (uuid) => uuid.substring(0, 8);

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "100%";
      document.getElementById("standard-modal").style.height = "110%";

      document.getElementById("controlPanelContentContainer").style.overflow =
        "hidden";
    }
  };

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(props.language.connectionAlert);
    setPopupIcon("error");
  };

  const showEditOptionCourse = async (e) => {
    e.target.parentNode.parentNode.childNodes[1].childNodes[0].disabled = false;
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

  const closeEditCourse = async (e) => {
    e.preventDefault();
    e.target.parentNode.parentNode.childNodes[1].childNodes[0].disabled = true;
    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const finalizedEdit = (type, icon, pop, text, confirmDel) => {
    fetchCoursePage(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(pop);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  };

  const finalizedCreate = (text, type) => {
    fetchCoursePage(actualPage);
    setPopup(true);
    setPopupType(type);
    setPopupText(text);
  };

  const finalizedDelete = (type, icon, text, confirmDel) => {
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchCoursePage(actualPage);
    switchEditState(false);
  };

  const editCourse = async (e, c) => {
    e.preventDefault();
    switchEditState(false);
    let value = document.getElementById("inputName_" + c.id).value;
    if (value.value !== "") {
      API.asynchronizeRequest(function () {
        COURSESERVICE.editCourse({
          id: c.id,
          name: value,
          institutions_id: c.institution_id,
        })
          .then((x) => {
            if (x) {
              let num = 0;
              while (num < 4) {
                e.target.parentNode.childNodes[num].style.display === "block"
                  ? (e.target.parentNode.childNodes[num].style.display = "none")
                  : (e.target.parentNode.childNodes[num].style.display =
                      "block");
                num += 1;
              }
              e.target.parentNode.parentNode.childNodes[1].childNodes[0].disabled = true;
              finalizedEdit(
                "info",
                true,
                true,
                props.language.editAlertCompleted,
                false
              );
            }
          })
          .catch(async (error) => {
            if (error) {
              await interceptExpiredToken(error);
              finalizedEdit(
                "error",
                true,
                true,
                props.language.editAlertFailed,
                false
              );
            }
          });
      }).then(async (x) => {
        if (x) {
          await interceptExpiredToken(e);
          connectionAlert();
        }
      });
    }
  };

  const fetchInstitutions = () => {
    API.asynchronizeRequest(function () {
      INSTITUTIONSERVICES.fetchInstitutions()
        .then((i) => {
          setInstitutions(i.data);
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

  const fetchCoursePage = async (page) => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.pagedCourses(page)
        .then((i) => {
          setCourses(i.data.current_page);
          setMaxPages(i.data.total_pages);
          setActualPage(i.data.page);
          fetchInstitutions();
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

  const createCourse = (e) => {
    e.preventDefault();
    switchEditState(false);
    let cName = document.getElementById("c_name").value;
    let cInst = document.getElementById("institution_chooser").value;
    if (cName.length > 1 && cInst !== "--") {
      API.asynchronizeRequest(function () {
        COURSESERVICE.createCourse({
          name: cName,
          institution_id: cInst,
        })
          .then((x) => {
            if (courses.length === 0) {
              let instTemp = null;
              for (let inst of institutions) {
                if (inst.id === cInst) {
                  instTemp = inst.name;
                }
              }
              SUBJECTSERVICE.createSubject({
                name: "General",
                description: "Automated subject for " + instTemp,
                color: "#96ffb2",
                course_id: x.data.id,
              })
                .then((e) => {
                  if (e) {
                    finalizedCreate(props.language.creationCompleted, "info");
                  }
                })
                .catch(async (e) => {
                  if (e) {
                    await interceptExpiredToken(e);
                    finalizedCreate(props.language.creationFailed, "error");
                  }
                });
            } else {
              finalizedCreate(props.language.creationCompleted, "info");
            }
          })
          .catch(async (e) => {
            if (e) {
              await interceptExpiredToken(e);
              finalizedCreate(props.language.creationFailed, "error");
            }
          });
      }).then(async (e) => {
        if (e) {
          await interceptExpiredToken(e);
          finalizedCreate(props.language.connectionAlert, "error");
        }
      });
    } else {
      finalizedCreate(props.language.creationAlert, "error");
    }
  };

  const confirmDeleteEvent = async (id) => {
    finalizedDelete("warning", true, props.language.deleteAlert, true);
    setIdDelete(id);
  };

  const deleteCourse = (id) => {
    switchEditState(true);
    API.asynchronizeRequest(function () {
      if (courses.length === 1) {
        COURSESERVICE.deleteCourse(id)
          .then((e) => {
            if (e) {
              finalizedDelete(
                "info",
                true,
                props.language.deleteAlertCompleted,
                false
              );
            }
          })
          .catch(async (e) => {
            if (e) {
              await interceptExpiredToken(e);
              finalizedDelete(
                "error",
                true,
                props.language.deleteAlertFailed,
                false
              );
            }
          });
      } else {
        COURSESERVICE.deleteCourse(id)
          .then((e) => {
            if (e) {
              finalizedDelete(
                "info",
                true,
                props.language.deleteAlertCompleted,
                false
              );
              fetchCoursePage(actualPage);
            }
          })
          .catch(async (e) => {
            if (e) {
              await interceptExpiredToken(e);
              finalizedDelete(
                "error",
                true,
                props.language.deleteAlertFailed,
                false
              );
            }
          });
      }
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const handleChange = (id) => {
    setChangeName(true);
    return document.getElementById("inputName_" + id).value;
  };

  useEffect(() => {
    setSearch(props.search);
  }, [props.search]);

  useEffect(() => {
    fetchCoursePage(1);
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{props.language.name}</th>
              <th>{props.language.linkedInstitution}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button onClick={createCourse}>
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
                <input
                  id="c_name"
                  type="text"
                  placeholder={props.language.name}
                />
              </td>
              <td>
                <select defaultValue={"--"} id="institution_chooser">
                  <option value="--">{props.language.chooseInstitution}</option>
                  {institutions.map((i) => {
                    return (
                      <option key={`${i.id}`} value={i.id}>
                        {i.name}
                      </option>
                    );
                  })}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {courses && courses.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchCoursePage(p)}
                maxPages={maxPages}
              />
            </div>

            <div className="courses-table-info">
              <table className="eventList" style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>{props.language.code}</th>
                    <th>{props.language.name}</th>
                    <th>{props.language.linkedInstitution}</th>
                    <th>{props.language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => {
                    if (search.length > 0) {
                      if (c.name.toLowerCase().includes(search.toLowerCase())) {
                        return (
                          <tr key={c.id}>
                            <td>
                              <input
                                disabled
                                type="text"
                                value={shortUUID(c.id)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                id={"inputName_" + c.id}
                                disabled
                                value={changeName === false ? c.name : newName}
                                onChange={() => {
                                  handleChange(c.id);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                disabled
                                type="text"
                                value={c.institution.name}
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
                                onClick={() => {
                                  confirmDeleteEvent(c.id);
                                }}
                                style={{ marginRight: "5px" }}
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
                                  showEditOptionCourse(e, c.id);
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
                                style={{
                                  marginRight: "5px",
                                  display: "none",
                                }}
                                onClick={(e) => {
                                  editCourse(e, c);
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
                                  closeEditCourse(e, c.id);
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
                        <tr key={c.id}>
                          <td>
                            <input disabled type="text" value={c.id} />
                          </td>
                          <td>
                            <input
                              id={"inputName_" + c.id}
                              disabled
                              type="text"
                              value={changeName === false ? c.name : newName}
                              onChange={() => {
                                handleChange(c.id);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              disabled
                              type="text"
                              value={c.institution.name}
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
                              onClick={() => {
                                confirmDeleteEvent(c.id);
                              }}
                              style={{ marginRight: "5px" }}
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
                                showEditOptionCourse(e, c.id);
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
                                editCourse(e, c);
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
                                closeEditCourse(e, c.id);
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
          setIsConfirmDelete(false);
          deleteCourse(idDelete);
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setIsConfirmDelete(false);
          setPopup(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
