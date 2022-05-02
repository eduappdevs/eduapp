import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as INSTITUTIONSERVICES from "../services/institution.service";
import * as COURSESERVICE from "../services/course.service";
import * as SUBJECTSERVICE from "../services/subject.service";

export default function CourseConfig() {
  const [courses, setCourses] = useState(null);
  const [institutions, setInstitutions] = useState([]);

  const showEditOptionCourse = async (e, id) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let length = document.getElementsByTagName("input").length;
      for (let i = 0; i < length; i++) {
        let valueElement = document.getElementsByTagName("input")[i].value;
        if (parseInt(valueElement) === id) {
          let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
          buttonDelete.style.display = "none";
          let button = e.target.parentNode;
          button.style.display = "none";
          let checkButton = e.target.parentNode.parentNode.childNodes[2];
          checkButton.style.display = "block";
          let cancelButton = e.target.parentNode.parentNode.childNodes[3];
          cancelButton.style.display = "block";
          name.disabled = false;
        }
      }
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let length = document.getElementsByTagName("input").length;
        for (let i = 0; i < length; i++) {
          let valueElement = document.getElementsByTagName("input")[i].value;
          if (!valueElement) {
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

            name.disabled = false;
          }
        }
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let length = document.getElementsByTagName("input").length;
        for (let i = 0; i < length; i++) {
          let valueElement = document.getElementsByTagName("input")[i].value;
          if (parseInt(valueElement) === id) {
            let buttonDelete = e.target.parentNode.childNodes[0];
            buttonDelete.style.display = "none";
            let button = e.target.parentNode.childNodes[1];
            button.style.display = "none";
            let checkButton = e.target.parentNode.childNodes[2];
            checkButton.style.display = "block";
            let cancelButton = e.target.parentNode.childNodes[3];
            cancelButton.style.display = "block";
            name.disabled = false;
          }
        }
      }
    }
  };

  const closeEditCourse = async (e, id) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let length = document.getElementsByTagName("input").length;
      for (let i = 0; i < length; i++) {
        let valueElement = document.getElementsByTagName("input")[i].value;
        if (parseInt(valueElement) === id) {
          let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
          buttonDelete.style.display = "block";
          let button = e.target.parentNode.parentNode.childNodes[1];
          button.style.display = "block";
          let checkButton = e.target.parentNode.parentNode.childNodes[2];
          checkButton.style.display = "none";
          let cancelButton = e.target.parentNode.parentNode.childNodes[3];
          cancelButton.style.display = "none";
          name.disabled = true;
        }
      }
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[1].childNodes[1].childNodes[0];
        let length = document.getElementsByTagName("input").length;
        for (let i = 0; i < length; i++) {
          let valueElement = document.getElementsByTagName("input")[i].value;
          if (parseInt(valueElement) === id) {
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
          }
        }
      } else {
        let name =
          e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[1]
            .childNodes[0];
        let length = document.getElementsByTagName("input").length;
        for (let i = 0; i < length; i++) {
          let valueElement = document.getElementsByTagName("input")[i].value;
          if (parseInt(valueElement) === id) {
            let buttonDelete = e.target.parentNode.childNodes[0];
            buttonDelete.style.display = "block";
            let button = e.target.parentNode.childNodes[1];
            button.style.display = "block";
            let checkButton = e.target.parentNode.childNodes[2];
            checkButton.style.display = "none";
            let cancelButton = e.target.parentNode.childNodes[3];
            cancelButton.style.display = "none";
            name.disabled = true;
          }
        }
      }
    }
  };

  const editCourse = async (e, c) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let length = document.getElementsByTagName("input").length;
      for (let i = 0; i < length; i++) {
        let valueElement = document.getElementsByTagName("input")[i].value;
        if (parseInt(valueElement) === c.id) {
          let value = document.getElementById("inputName_" + c.id);
          if (value.value !== "") {
            API.asynchronizeRequest(function () {
              COURSESERVICE.editCourse({
                id: c.id,
                name: value.value,
                institutions_id: c.institution_id,
              })
                .then(() => {
                  fetchInstitutions();
                  fetchCourses();

                  let buttonDelete =
                    e.target.parentNode.parentNode.childNodes[0];
                  buttonDelete.style.display = "block";
                  let button = e.target.parentNode.parentNode.childNodes[1];
                  button.style.display = "block";
                  let checkButton =
                    e.target.parentNode.parentNode.childNodes[2];
                  checkButton.style.display = "none";
                  let cancelButton =
                    e.target.parentNode.parentNode.childNodes[3];
                  cancelButton.style.display = "none";
                  name.disabled = true;
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
        }
      }
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let length = document.getElementsByTagName("input").length;
        for (let i = 0; i < length; i++) {
          let valueElement = document.getElementsByTagName("input")[i].value;
          if (parseInt(valueElement) === c.id) {
            let value = document.getElementById("inputName_" + c.id);
            if (value.value !== "") {
              API.asynchronizeRequest(function () {
                COURSESERVICE.editCourse({
                  id: c.id,
                  name: value.value,
                  institutions_id: c.institution_id,
                })
                  .then(() => {
                    fetchInstitutions();
                    fetchCourses();

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
                    console.log();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
            }
          }
        }
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let length = document.getElementsByTagName("input").length;
        for (let i = 0; i < length; i++) {
          let valueElement = document.getElementsByTagName("input")[i].value;
          if (parseInt(valueElement) === c.id) {
            let value = document.getElementById("inputName_" + c.id);
            if (value.value !== "") {
              API.asynchronizeRequest(function () {
                COURSESERVICE.editCourse({
                  id: c.id,
                  name: value.value,
                  institutions_id: c.institution_id,
                })
                  .then(() => {
                    let buttonDelete = e.target.parentNode.childNodes[0];
                    buttonDelete.style.display = "block";
                    let button = e.target.parentNode.childNodes[1];
                    button.style.display = "block";
                    let checkButton = e.target.parentNode.childNodes[2];
                    checkButton.style.display = "none";
                    let cancelButton = e.target.parentNode.childNodes[3];
                    cancelButton.style.display = "none";
                    name.disabled = true;

                    fetchInstitutions();
                    fetchCourses();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
            }
          }
        }
      }
    }
  };

  const fetchInstitutions = () => {
    API.asynchronizeRequest(function () {
      INSTITUTIONSERVICES.fetchInstitutions().then((i) => {
        setInstitutions(i.data);
      });
    });
  };

  const fetchCourses = () => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.fetchCourses().then((i) => {
        setCourses(i.data);
      });
    });
  };

  const createCourse = () => {
    let cName = document.getElementById("c_name").value;
    let cInst = document.getElementById("institution_chooser").value;
    if (cName.length > 1 && cInst !== "--") {
      API.asynchronizeRequest(function () {
        COURSESERVICE.createCourse({
          name: cName,
          institution_id: parseInt(cInst),
        }).then((x) => {
          if (courses.length === 0) {
            let instTemp = null;
            for (let inst of institutions) {
              if (inst.id === parseInt(cInst)) {
                instTemp = inst.name;
              }
            }
            SUBJECTSERVICE.createSubject({
              name: "Noticias",
              teacherInCharge: instTemp,
              description: "Noticias para el instituto " + instTemp,
              color: "#96ffb2",
              course_id: parseInt(x.data.id),
            }).then(() => {
              fetchCourses();
              swapIcons(false);
            });
          } else {
            fetchCourses();
            swapIcons(false);
          }
        });
      });
    }
  };

  const deleteCourse = (id) => {
    API.asynchronizeRequest(function () {
      if (courses.length === 1) {
        API.asynchronizeRequest(function () {
          COURSESERVICE.deleteCourse(id).then(() => {
            fetchCourses();
          });
        });
      } else {
        API.asynchronizeRequest(function () {
          COURSESERVICE.deleteCourse(id).then(() => {
            fetchCourses();
          });
        });
      }
    });
  };

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
      document.getElementById("ins-add-icon").style.display = "none";
    } else {
      document.getElementById("submit-loader").style.display = "none";
      document.getElementById("ins-add-icon").style.display = "block";
    }
  };

  const handleChange = (id) => {
    var content = document.getElementById("inputName_" + id);

    return content.value;
  };

  useEffect(() => {
    fetchCourses();
    fetchInstitutions();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table className="createTable">
          <thead>
            <tr>
              <th>Actions</th>
              <th>Name</th>
              <th>Linked Institution</th>
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
                </button>
              </td>
              <td>
                <input id="c_name" type="text" placeholder="Name" />
              </td>
              <td>
                <select defaultValue={"--"} id="institution_chooser">
                  <option value="--">Choose Institution</option>
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

        <table className="eventList" style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Linked Institution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses
              ? courses.map((c) => {
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
                          placeholder={c.name}
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
                            deleteCourse(c.id);
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
                })
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
