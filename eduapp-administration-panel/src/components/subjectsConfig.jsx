import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as COURSESERVICE from "../services/course.service";

export default function SubjectsConfig(props) {
  const [subjects, setSubjects] = useState(null);
  const [courses, setCourses] = useState([]);
  const [changeColor, setChangeColor] = useState(false);
  const [newColor] = useState();

  const shortUUID = (uuid) => uuid.substring(0, 8);

  const fetchSubjects = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects().then((sjs) => {
        setSubjects(sjs.data);
      });
    });
  };

  const fetchCourses = () => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.fetchCourses().then((cs) => {
        setCourses(cs.data);
      });
    });
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
      swapIcons(true);
      API.asynchronizeRequest(function () {
        SUBJECTSERVICE.createSubject({
          name: name,
          description: desc,
          color: color,
          course_id: sel_course,
        }).then(() => {
          fetchSubjects();
          swapIcons(false);
        });
      });
    }
  };

  const deleteSubject = (id) => {
    //eliminar sessiones + modal de aviso y mostrar las sessiones que se eliminarán
    fetchCourse(id);
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.deleteSubject(id).then(() => {
        fetchSubjects();
      });
    });
  };

  const fetchCourse = (id) => {};

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
      document.getElementById("ins-add-icon").style.display = "none";
    } else {
      document.getElementById("submit-loader").style.display = "none";
      document.getElementById("ins-add-icon").style.display = "block";
    }
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
            })
            .catch((error) => {
              console.log(error);
            });
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
            })
            .catch((error) => {
              console.log(error);
            });
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

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

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
                    xmlns="http://www.w3.org/2000/ svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                    id="ins-add-icon"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
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
            {subjects
              ? subjects.map((sj) => {
                  return (
                    <tr key={sj.id}>
                      <td>
                        <input disabled type="text" value={shortUUID(sj.id)} />
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
                            deleteSubject(sj.id);
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
                })
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
