import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as COURSESERVICE from "../services/course.service";
import StandardModal from "./modals/standard-modal/StandardModal";

export default function SubjectsConfig(props) {
  const [subjects, setSubjects] = useState(null);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [changeColor, setChangeColor] = useState(false);
  const [newColor] = useState();

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  let course_filter = {};

  const fetchSubjects = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects().then((sjs) => {
        setSubjects(sjs.data);
        course_filter.subject = sjs.data;
      });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The subjects could not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
      }
    });
  };

  const switchSaveState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflow =
        "scroll";
      document
        .getElementById("commit-loader-2")
        .classList.remove("commit-loader-hide");
      document.getElementById("add-svg").classList.add("commit-loader-hide");
    } else {
      document.getElementById("controlPanelContentContainer").style.overflow =
        "hidden";
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
      });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The courses could not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
      }
    });
  };

  const alertCreate = async () => {
    setPopupText("Required information is missing.");
    setPopupType("error");
    setPopup(true);
  };

  const createSubject = () => {
    let name = document.getElementById("sj_name").value;
    let desc = document.getElementById("sj_desc").value;
    let color = document.getElementById("sj_color").value;
    let sel_course = document.getElementById("course_chooser").value;

    let info = [name, desc, color, sel_course];

    let valid = true;
    for (let i of info) {
      if (i.length < 2 && i === "-") {
        valid = false;
        break;
      }
    }

    if (valid) {
      API.asynchronizeRequest(function () {
        SUBJECTSERVICE.createSubject({
          name: name,
          description: desc,
          color: color,
          course_id: parseInt(sel_course),
        })
          .then(() => {
            fetchSubjects();
            setPopup(true);
            setPopupType("info");
            setPopupText("The calendar events was created successfully.");
            switchSaveState(true);
          })
          .catch((e) => {
            if (e) {
              alertCreate();
            }
          });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The subject could not be published, check if you have an internet connection."
          );
          setPopupIcon("error");
        }
      });
    }
  };

  const confirmDeleteEvent = async (id) => {
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText("Are you sure you want to delete this subject?");
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(id);
  };

  const showDeleteError = () => {
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText("The subject could not be deleted.");
    setIsConfirmDelete(false);
  };

  const deleteSubject = (id) => {
    //eliminar sessiones + modal de aviso y mostrar las sessiones que se eliminarán
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.deleteSubject(id)
        .then(() => {
          fetchSubjects();
        })
        .catch((e) => {
          if (e) {
            showDeleteError();
          }
        });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The subject could not be deleted, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(true);
      }
    });
  };

  const showEditOptionSubject = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let color =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];

      name.disabled = false;
      description.disabled = false;
      color.disabled = false;

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
        let color =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];
        name.disabled = false;
        description.disabled = false;
        color.disabled = false;

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
        let color = e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        name.disabled = false;
        description.disabled = false;
        color.disabled = false;
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

  const editSubject = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let color =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];

      let inputName = document.getElementById("inputName_" + s.id).value;
      let inputDescription = document.getElementById(
        "inputDescription_" + s.id
      ).value;
      let inputColor = document.getElementById("inputColor_" + s.id).value;

      let editTitle, editColor, editDescription;

      if (inputName !== "" && inputName !== s.name) {
        editTitle = inputName;
      } else {
        editTitle = s.name;
      }

      if (
        inputDescription !== "" &&
        inputDescription !== s.session_start_date
      ) {
        editDescription = inputDescription;
      } else {
        editDescription = s.description;
      }

      if (inputColor !== "" && inputColor !== s.session_end_date) {
        editColor = inputColor;
      } else {
        editColor = s.session_end_date;
      }

      API.asynchronizeRequest(function () {
        SUBJECTSERVICE.editSubject({
          id: s.id,
          name: editTitle,
          description: editDescription,
          color: editColor,
          course_id: s.course_id,
        })
          .then(() => {
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
            color.disabled = true;
            description.disabled = true;

            setPopup(true);
            setPopupType("info");
            setPopupText("The subject was edited successfully.");
            switchSaveState(false);
            setIsConfirmDelete(false);
          })
          .catch((e) => {
            if (e) {
              setPopupText(
                "The subject could not be edited, check if you entered the correct fields."
              );
              setPopupIcon("error");
              switchSaveState(false);
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The calendar session could not be edited, check if you have an internet connection."
          );
          setPopupIcon("error");
          setIsConfirmDelete(false);

          switchSaveState(false);
        }
      });
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let color =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;
        let inputColor = document.getElementById("inputColor_" + s.id).value;

        let editTitle, editColor, editDescription;

        if (inputName !== "" && inputName !== s.name) {
          editTitle = inputName;
        } else {
          editTitle = s.name;
        }

        if (
          inputDescription !== "" &&
          inputDescription !== s.session_start_date
        ) {
          editDescription = inputDescription;
        } else {
          editDescription = s.description;
        }

        if (inputColor !== "" && inputColor !== s.session_end_date) {
          editColor = inputColor;
        } else {
          editColor = s.session_end_date;
        }

        API.asynchronizeRequest(function () {
          SUBJECTSERVICE.editSubject({
            id: s.id,
            name: editTitle,
            description: editDescription,
            color: editColor,
            course_id: s.course_id,
          })
            .then(() => {
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
              description.disabled = true;
              color.disabled = true;
              setPopup(true);
              setPopupType("info");
              setPopupText("The subject was edited successfully.");
              switchSaveState(false);
              setIsConfirmDelete(false);
            })
            .catch((e) => {
              if (e) {
                setPopupText(
                  "The subject could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
                setIsConfirmDelete(false);
              }
            });
        }).then((e) => {
          if (e) {
            setPopup(true);
            setPopupText(
              "The calendar session could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
            switchSaveState(false);
            setIsConfirmDelete(false);
          }
        });
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let color = e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;
        let inputColor = document.getElementById("inputColor_" + s.id).value;

        let editTitle, editColor, editDescription;

        if (inputName !== "" && inputName !== s.name) {
          editTitle = inputName;
        } else {
          editTitle = s.name;
        }

        if (
          inputDescription !== "" &&
          inputDescription !== s.session_start_date
        ) {
          editDescription = inputDescription;
        } else {
          editDescription = s.description;
        }

        if (inputColor !== "" && inputColor !== s.session_end_date) {
          editColor = inputColor;
        } else {
          editColor = s.session_end_date;
        }

        API.asynchronizeRequest(function () {
          SUBJECTSERVICE.editSubject({
            id: s.id,
            name: editTitle,
            description: editDescription,
            color: editColor,
            course_id: s.course_id,
          })
            .then(() => {
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
              description.disabled = true;
              color.disabled = true;
              setPopup(true);
              setPopupType("info");
              setPopupText("The subject was edited successfully.");
              switchSaveState(false);
              setIsConfirmDelete(false);
            })
            .catch((e) => {
              if (e) {
                setPopupText(
                  "The subject could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
                setIsConfirmDelete(false);
              }
            });
        }).then((e) => {
          if (e) {
            setPopup(true);
            setPopupText(
              "The calendar session could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
            switchSaveState(false);
            setIsConfirmDelete(false);
          }
        });
      }
    }
  };

  const closeEditSubject = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let color =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      name.disabled = true;
      description.disabled = true;
      color.disabled = true;

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
        let color =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[3].childNodes[0];

        name.disabled = true;
        description.disabled = true;
        color.disabled = true;

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
        let color = e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        name.disabled = true;
        description.disabled = true;
        color.disabled = true;

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

  const handleChangeColor = (id) => {
    var content = document.getElementById("inputColor_" + id);
    setChangeColor(true);
    return content.value;
  };

  const courseFilter = (courseList) => {
    let filter = [];
    courseList.map((s) => {
      if (
        s.id ===
        (course_filter.filter === -1 ? s.id : parseInt(course_filter.filter))
      )
        filter.push(s);
      return true;
    });
    setSubjects(filter);
  };

  useEffect(() => {
    fetchSubjects();
    fetchCourses();

    document.addEventListener("filter_subject_course", (e) => {
      e.stopImmediatePropagation();
      course_filter.filter =
        e.detail === props.language.chooseCourse ? -1 : e.detail.split("_")[0];
      courseFilter(course_filter.subject);
    });
  }, []);

  useEffect(() => {
    console.log(props.search);
    setSearch(props.search);
  }, [props.search]);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{props.language.name}</th>
              <th>{props.language.description}</th>
              <th>{props.language.color}</th>
              <th>{props.language.linkedCourse}</th>
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
                <button onClick={createSubject}>
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
                  <div id="submit-loader" className="loader">
                    {props.language.loading} ...
                  </div>
                </button>
              </td>
              <td>
                <input id="sj_name" type="text" placeholder="Name" />
              </td>
              <td>
                <input id="sj_desc" type="text" placeholder="Description" />
              </td>
              <td>
                <input id="sj_color" type="color" placeholder="Description" />
              </td>
              <td>
                <select defaultValue={"-"} id="course_chooser">
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
        {subjects && subjects.length !== 0 ? (
          <table className="eventList" style={{ marginTop: "50px" }}>
            <thead>
              <tr>
                <th>{props.language.code}</th>
                <th>{props.language.name}</th>
                <th>{props.language.description}</th>
                <th>{props.language.color}</th>
                <th>{props.language.linkedCourse}</th>
                <th>{props.language.actions}</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sj) => {
                if (search.length > 0) {
                  console.log(sj.name, search);
                  if (sj.name.toLowerCase().includes(search.toLowerCase())) {
                    return (
                      <tr key={sj.id}>
                        <td>
                          <input disabled type="text" value={sj.id} />
                        </td>
                        <td>
                          <input
                            id={`inputName_${sj.id}`}
                            disabled
                            type="text"
                            placeholder={sj.name}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputDescription_${sj.id}`}
                            disabled
                            type="text"
                            placeholder={sj.description}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputColor_${sj.id}`}
                            disabled
                            type="color"
                            value={changeColor === false ? sj.color : newColor}
                            onChange={(e) => handleChangeColor(e, sj.id)}
                          />
                        </td>
                        <td>
                          <input disabled type="text" value={sj.course.name} />
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
                              confirmDeleteEvent(sj.id);
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
                              showEditOptionSubject(e, sj);
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
                              editSubject(e, sj);
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
                              closeEditSubject(e, sj);
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
                    <tr key={sj.id}>
                      <td>
                        <input disabled type="text" value={sj.id} />
                      </td>
                      <td>
                        <input
                          id={`inputName_${sj.id}`}
                          disabled
                          type="text"
                          placeholder={sj.name}
                        />
                      </td>
                      <td>
                        <input
                          id={`inputDescription_${sj.id}`}
                          disabled
                          type="text"
                          placeholder={sj.description}
                        />
                      </td>
                      <td>
                        <input
                          id={`inputColor_${sj.id}`}
                          disabled
                          type="color"
                          value={changeColor === false ? sj.color : newColor}
                          onChange={(e) => handleChangeColor(e, sj.id)}
                        />
                      </td>
                      <td>
                        <input disabled type="text" value={sj.course.name} />
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
                            confirmDeleteEvent(sj.id);
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
                            showEditOptionSubject(e, sj);
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
                            editSubject(e, sj);
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
                            closeEditSubject(e, sj);
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
          deleteSubject(idDelete);
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        onNoAction={() => {
          setPopup(false);
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        onCloseAction={() => {
          setPopup(false);
          switchSaveState();
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
