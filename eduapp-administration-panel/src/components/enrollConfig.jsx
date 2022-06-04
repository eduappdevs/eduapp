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

  const fetchTuitions = (pages) => {
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.pagedTuitions(pages)
        .then((ts) => {
          setTuitions(ts.data.current_page);
          setMaxPages(ts.data.total_pages);
          enrollment_filter.enroll = ts.data.current_page;
        })
        .catch(async (err) => {
          interceptExpiredToken(err);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        setPopup(true);
        setPopupText(
          "The tuitions not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(false);
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
        setPopup(true);
        setPopupText(
          "The users could not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(false);
      }
    });
  };

  const switchSaveState = (state) => {
    if (state) {
      document
        .getElementById("commit-loader-2")
        .classList.remove("commit-loader-hide");
      document.getElementById("add-svg").classList.add("commit-loader-hide");
    } else {
      document.getElementById("add-svg").classList.remove("commit-loader-hide");
      document
        .getElementById("commit-loader-2")
        .classList.add("commit-loader-hide");
    }
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
        setPopup(true);
        setPopupText(
          "The courses could not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(false);
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
    switchSaveState(true);

    let user = document.getElementById("user_select").value;
    let course = document.getElementById("course_select").value;

    let valid = true;
    if (user === "-" && course === "-") valid = false;

    if (valid) {
      API.asynchronizeRequest(function () {
        const payload = new FormData();
        payload.append("course_id", course);
        payload.append("user_id", user);

        TUITIONSSERVICE.createTuition(payload).then(() => {
          fetchAll();
          setPopup(true);
          setPopupType("info");
          setPopupText("The tuition was created successfully.");
          switchSaveState(false);
        });
      }).then(async (e) => {
        if (e) {
          await interceptExpiredToken(e);
          setPopup(true);
          setPopupText(
            "The enrollment could not be published, check if you have an internet connection."
          );
          setPopupIcon("error");
          switchSaveState(false);
        }
      });
    } else {
      alertCreate();
      switchSaveState(false);
    }
  };

  const alertCreate = async () => {
    setPopupText("Required information is missing.");
    setPopupType("error");
    setPopup(true);
    setIsConfirmDelete(false);
  };

  const deleteTuition = (id) => {
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.deleteTuition(id)
        .then(() => {
          fetchAll();
          setPopup(true);
          setPopupType("info");
          setPopupText("The enrollment was deleted successfully.");
          switchSaveState(false);
          setIsConfirmDelete(false);
        })
        .catch(async (e) => {
          await interceptExpiredToken(e);
          showDeleteError();
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        setPopup(true);
        setPopupText(
          "The enrollment could not be deleted, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(true);
      }
    });
  };

  const confirmDeleteEvent = async (id) => {
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText("Are you sure you want to delete this enrollment?");
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(id);
  };

  const showDeleteError = () => {
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText("The enrollment could not be deleted.");
    setIsConfirmDelete(false);
  };

  const showEditOptionSession = (e) => {
    if (e.target.tagName === "svg") {
      let email =
        e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0];
      let course =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];

      email.disabled = false;
      course.disabled = false;

      let buttonDelete = e.target.parentNode.parentNode.childNodes[1];
      buttonDelete.style.display = "none";
      let button = e.target.parentNode.parentNode.childNodes[0];
      button.style.display = "none";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "block";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "block";
      listCourse(course.value);
      listUser(email.value);
    } else {
      if (e.target.tagName === "path") {
        let email =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0]
            .childNodes[0];
        let course =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];

        email.disabled = false;
        course.disabled = false;

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
        listCourse(course.value);
        listUser(email.value);
      } else {
        let email = e.target.parentNode.parentNode.childNodes[0].childNodes[0];
        let course = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        email.disabled = false;
        course.disabled = false;

        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "none";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "none";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "block";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "block";
        listCourse(course.value);
        listUser(email.value);
      }
    }
  };

  const editSession = (e, s) => {
    if (e.target.tagName === "svg") {
      let email =
        e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0];
      let course =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];

      let inputEmail = document.getElementById("inputEmail_" + s.id).value;
      let inputCourse = document.getElementById("inputCourse_" + s.id).value;

      let editEmail, editCourse;

      if (inputEmail !== "" && inputEmail !== s.user_id) {
        editEmail = inputEmail;
      } else {
        editEmail = s.user_id;
      }

      if (inputCourse !== "" && inputCourse !== s.session_start_date) {
        editCourse = inputCourse;
      } else {
        editCourse = s.session_start_date;
      }

      API.asynchronizeRequest(function () {
        TUITIONSSERVICE.editTuition({
          id: s.id,
          course_id: editCourse,
          user_id: editEmail,
        })
          .then((error) => {
            if (error) {
              fetchAll();
              let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
              buttonDelete.style.display = "block";
              let button = e.target.parentNode.parentNode.childNodes[1];
              button.style.display = "block";
              let checkButton = e.target.parentNode.parentNode.childNodes[2];
              checkButton.style.display = "none";
              let cancelButton = e.target.parentNode.parentNode.childNodes[3];
              cancelButton.style.display = "none";
              email.disabled = true;
              course.disabled = true;

              setPopup(true);
              setPopupType("info");
              setPopupText("The enrollment was edited successfully.");
              switchSaveState(false);
              setIsConfirmDelete(false);
            }
          })
          .catch(async (e) => {
            if (e) {
              await interceptExpiredToken(e);
              setPopupText(
                "The enrollment could not be edited, check if you entered the correct fields."
              );
              setPopupIcon("error");
              switchSaveState(false);
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).then(async (e) => {
        if (e) {
          await interceptExpiredToken(e);
          setPopup(true);
          setPopupText(
            "The enrollment could not be edited, check if you have an internet connection."
          );
          setPopupIcon("error");
          switchSaveState(false);
          setIsConfirmDelete(false);
        }
      });
    } else {
      if (e.target.tagName === "path") {
        let email =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0]
            .childNodes[0];
        let course =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];

        let inputEmail = document.getElementById("inputEmail_" + s.id).value;
        let inputCourse = document.getElementById("inputCourse_" + s.id).value;

        let editEmail, editCourse;

        if (inputEmail !== "" && inputEmail !== s.user_id) {
          editEmail = inputEmail;
        } else {
          editEmail = s.user_id;
        }

        if (inputCourse !== "" && inputCourse !== s.session_start_date) {
          editCourse = inputCourse;
        } else {
          editCourse = s.session_start_date;
        }

        API.asynchronizeRequest(function () {
          TUITIONSSERVICE.editTuition({
            id: s.id,
            course_id: editCourse,
            user_id: editEmail,
          })
            .then((error) => {
              if (error) {
                fetchAll();
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
                course.disabled = true;
                email.disabled = true;

                switchSaveState(false);
                setPopup(true);
                setPopupType("info");
                setPopupText("The enrollment was edited successfully.");
                setIsConfirmDelete(false);
              }
            })
            .catch((e) => {
              if (e) {
                setPopupText(
                  "The enrollment could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                switchSaveState(false);
                setIsConfirmDelete(false);
                setPopup(true);
              }
            });
        }).then(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            setPopup(true);
            setPopupText(
              "The enrollment could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
            switchSaveState(false);
            setIsConfirmDelete(false);
          }
        });
      } else {
        let email = e.target.parentNode.parentNode.childNodes[0].childNodes[0];
        let course = e.target.parentNode.parentNode.childNodes[1].childNodes[0];

        let inputEmail = document.getElementById("inputEmail_" + s.id).value;
        let inputCourse = document.getElementById("inputCourse_" + s.id).value;

        let editEmail, editCourse;

        if (inputEmail !== "" && inputEmail !== s.user_id) {
          editEmail = inputEmail;
        } else {
          editEmail = s.user_id;
        }

        if (inputCourse !== "" && inputCourse !== s.session_start_date) {
          editCourse = inputCourse;
        } else {
          editCourse = s.session_start_date;
        }

        console.log(editEmail, editCourse);
        API.asynchronizeRequest(function () {
          TUITIONSSERVICE.editTuition({
            id: s.id,
            course_id: editCourse,
            user_id: editEmail,
          })
            .then((error) => {
              if (error) {
                fetchAll();
                let buttonDelete = e.target.parentNode.childNodes[0];
                buttonDelete.style.display = "block";
                let button = e.target.parentNode.childNodes[1];
                button.style.display = "block";
                let checkButton = e.target.parentNode.childNodes[2];
                checkButton.style.display = "none";
                let cancelButton = e.target.parentNode.childNodes[3];
                cancelButton.style.display = "none";
                email.disabled = true;
                course.disabled = true;

                setPopup(true);
                setPopupType("info");
                setPopupText("The enrollment was edited successfully.");
                switchSaveState(false);
                setIsConfirmDelete(false);
              }
            })
            .catch(async (e) => {
              if (e) {
                console.log(e);
                await interceptExpiredToken(e);
                setPopupText(
                  "The enrollment could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                switchSaveState(false);
                setIsConfirmDelete(false);
                setPopup(true);
              }
            });
        }).then(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            setPopup(true);
            setPopupText(
              "The enrollment could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
            switchSaveState(false);
            setIsConfirmDelete(false);
          }
        });
      }
    }
  };

  const closeEditSession = (e, s) => {
    if (e.target.tagName === "svg") {
      let email =
        e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0];
      let course =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];

      email.disabled = true;
      course.disabled = true;

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
        let email =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[0].childNodes[0];
        let course =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[1].childNodes[0];

        email.disabled = true;
        course.disabled = true;

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
        let email = e.target.parentNode.parentNode.childNodes[0].childNodes[0];
        let course = e.target.parentNode.parentNode.childNodes[1].childNodes[0];

        email.disabled = true;
        course.disabled = true;

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

  const listCourse = (course) => {
    let list = [];
    courses.map((c) => {
      if (c.id !== parseInt(course)) {
        list.push(c);
      }
      return true;
    });
    setCourseEdit(list);
  };

  const listUser = (user) => {
    let list = [];
    users.map((c) => {
      if (c.id !== parseInt(user)) {
        list.push(c);
      }
      return true;
    });
    setEmailEdit(list);
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
      <div className="schedulesesionslist-main-container">
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
                              <select id={`inputEmail_${t.id}`} disabled>
                                <option
                                  value={t.user.id}
                                  defaultValue={t.user.id}
                                >
                                  {t.user.email}
                                </option>
                                {emailEdit.map((e) => {
                                  return (
                                    <option key={e.id} value={e.id}>
                                      {e.user.email}
                                    </option>
                                  );
                                })}
                                {}
                              </select>
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
                                  editSession(e, t);
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
                            <select id={`inputEmail_${t.id}`} disabled>
                              <option
                                value={t.user.id}
                                defaultValue={t.user.id}
                              >
                                {t.user.email}
                              </option>
                              {emailEdit.map((e) => {
                                return (
                                  <option key={e.id} value={e.id}>
                                    {e.user.email}
                                  </option>
                                );
                              })}
                              {}
                            </select>
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
                                editSession(e, t);
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
        }}
        onCloseAction={() => {
          setPopup(false);
          switchSaveState();
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
