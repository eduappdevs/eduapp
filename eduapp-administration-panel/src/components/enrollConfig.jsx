/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState, useRef, useCallback } from "react";
import * as API from "../API";
import * as TUITIONSSERVICE from "../services/enrollConfig.service";
import * as USERSSERVICE from "../services/user.service";
import * as COURSESERVICE from "../services/course.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import PageSelect from "./pagination/PageSelect";
import useFilter from "../hooks/useFilter";
import { getEnrollmentFields } from "../constants/search_fields";
import Typeahead from "./Typeahead";
import { LoaderCtx } from "../hooks/LoaderContext";

export default function EnrollConfig() {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [language] = useContext(LanguageCtx);

  const [tuitions, setTuitions] = useState(null);
  const [users, setUsers] = useState(null);
  const [courses, setCourses] = useState(null);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const tuitionBeforeEditing = useRef(null);

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const switchEditState = useCallback((state) => {
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
  }, []);

  const finalizedEdit = useCallback((type, icon, text, confirmDel) => {
    fetchTuitions(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  }, [actualPage]);

  const finalizedCreate = useCallback((type, icon, txt, confirmDel) => {
    fetchTuitions(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(txt);
  }, [actualPage]);

  const finalizedDelete = useCallback((type, icon, confirmDel, text) => {
    switchEditState(false);
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchTuitions(actualPage);
  }, [actualPage]);

  const connectionAlert = useCallback(async () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  }, [language]);

  const fetchTuitions = useCallback((pages, order = null, searchParams) => {
    API.asynchronizeRequest(() => {
      TUITIONSSERVICE.pagedTuitions(pages, order, searchParams)
        .then((ts) => {
          setActualPage(ts.data.page);
          setMaxPages(ts.data.total_pages);
          setTuitions(ts.data.current_page);
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
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
      USERSSERVICE.fetchUserInfos()
      .then((us) => setUsers(us.data));
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const fetchCourses = useCallback(() => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.fetchCourses()
      .then((cs) => setCourses(cs.data));
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const fetchAll = () => {
    fetchCourses();
    fetchUsers();
  };

  const alertCreate = useCallback(async () => {
    setPopupText(language.creationAlert);
    setPopupType("error");
    setPopup(true);
  }, [language]);

  const createTuition = useCallback(async (e) => {
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
              fetchTuitions(actualPage);
              setPopup(true);
              setPopupType("info");
              setPopupText(language.creationCompleted);
            }
          })
          .catch((e) => {
            if (e) {
              interceptExpiredToken(e);
              setPopup(true);
              setPopupType("info");
              setPopupText(language.creationAlert);
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
  }, [language]);

  const confirmDeleteEvent = useCallback(async (id) => {
    finalizedDelete("warning", true, true, language.deleteAlert);
    setIdDelete(id);
    switchEditState(false);
  }, [language]);

  const deleteTuition = useCallback((id) => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.deleteTuition(id)
        .then((e) => {
          if (e) {
            finalizedDelete("info", true, false, language.deleteAlertCompleted);
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedDelete("error", true, false, language.deleteAlertFailed);
            await interceptExpiredToken(e);
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, [language]);

  const editEnroll = useCallback((e, s) => {
    switchEditState(false);

    let inputUser = document.getElementById("inputUserID_" + s.id).value;
    let inputCourse = document.getElementById("inputCourseID_" + s.id).value;

    let editUser,
      editCourse;

    if (inputUser !== "" && inputUser !== s.user.id) {
      editUser = inputUser;
    } else {
      editUser = s.user.id;
    }

    if (inputCourse !== "" && inputCourse !== s.course.id) {
      editCourse = inputCourse;
    } else {
      editCourse = s.course.id;
    }

    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.editTuition({
        id: s.id,
        course_id: editCourse,
        user_id: editUser,
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
            let disable = 0;
            while (disable < 2) {
              e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
              disable += 1;
            }
            finalizedEdit("info", true, language.editAlertCompleted, false);
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedEdit("error", true, language.editAlertFailed, false);
            await interceptExpiredToken(e);
          }
        });
    }).then(async (e) => {
      if (e) {
        alertCreate();
        await interceptExpiredToken(e);
      }
    });
  }, [language]);

  const closeEditTuition = (e, index) => {
    let disable = 0;
    while (disable < 2) {
      e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
      disable += 1;
    }

    let auxTuitions = [...tuitions];
    auxTuitions[index] = { ...tuitionBeforeEditing.current };
    setTuitions(auxTuitions);

    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const showEditOptionTuition = (e, index) => {
    let disable = 0;
    while (disable < 2) {
      e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = false;
      disable += 1;
    }
    tuitionBeforeEditing.current = { ...tuitions[index] };


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

  const handleChangeUser = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    users.map(u => {
      if (u.user.id == newValue) {
        const newTuitions = [...tuitions];
        newTuitions[index][inputName] = u;
        setTuitions(newTuitions);
        return
      }
    })
  }

  const handleChangeCourse = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    courses.map(c => {
      if (c.id == newValue) {
        const newTuitions = [...tuitions];
        newTuitions[index][inputName] = c;
        setTuitions(newTuitions);
        return
      }
    })
  }

  const memoizedTuitions = () => {
    return (
      <>
        {tuitions && tuitions.map((t, index) => {
          return (
            <tr key={t.id}>
              <td>
                <select id={`inputUserID_${t.id}`} disabled
                  name="user"
                  onChange={(event) => handleChangeUser(index, event)}>
                  {users
                    && users.map((thisUser) => {
                      if (t.user.id == thisUser.user.id) {
                        return (
                          <option key={thisUser.user.id} value={thisUser.user.id} selected>
                            {thisUser.user.email}
                          </option>
                        )
                      }
                      return (<option key={thisUser.user.id} value={thisUser.user.id}>
                        {thisUser.user.email}
                      </option>
                      )
                    })
                  }
                </select>
              </td>
              <td>
                <select id={`inputCourseID_${t.id}`} disabled
                  name="course"
                  onChange={(event) => handleChangeCourse(index, event)}>
                  {courses
                    && courses.map((thisCourse) => {
                      if (t.course.id == thisCourse.id) {
                        return (
                          <option key={thisCourse.id} value={thisCourse.id} selected>
                            {thisCourse.name}
                          </option>
                        )
                      }
                      return (<option key={thisCourse.id} value={thisCourse.id}>
                        {thisCourse.name}
                      </option>
                      )
                    })}
                </select>
              </td>
              <td style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              >
                <button
                  style={{ marginRight: "5px" }}
                  onClick={() => confirmDeleteEvent(t.id)}
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
                  onClick={(e) => showEditOptionTuition(e, index)}
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
                  onClick={(e) => editEnroll(e, t)}
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
                  onClick={(e) => closeEditTuition(e, index)}
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
      </>
    )
  }

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchTuitions(1, {
      field: searchParams.selectedField,
      order: searchParams.order,
    }, searchParams);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getEnrollmentFields(language),
      selectedField: getEnrollmentFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  return (
    <>
      <div className="add-form">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{language.user}</th>
              <th>{language.course}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{language.add}:</th>
              <td>
                <Typeahead items={users?.map(u => ({
                  id: u.user.id, name: u.user.email
                }))}
                  fieldId="user_select" />
              </td>
              <td>
                <select defaultValue={"-"} id="course_select">
                  <option value="-">{language.chooseCourse}</option>
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
              <td className="action-column">
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
                    {language.loading} ...
                  </div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="notify-users">
        <PageSelect
          onPageChange={(p) => fetchTuitions(p, {
            field: searchParams.selectedField,
            order: searchParams.order,
          }, searchParams)}
          actualPage={actualPage}
          maxPages={maxPages}
        />
      </div>
      <div className="list-main-container" id="scroll">
        {tuitions && tuitions.length !== 0 ? (
          <div className="table-info">
            <table style={{ marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>{language.user}</th>
                  <th>{language.course}</th>
                  <th>{language.actions}</th>
                </tr>
              </thead>
              <tbody>
                {memoizedTuitions()}
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
