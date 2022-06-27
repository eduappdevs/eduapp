/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as COURSESERVICE from "../services/course.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import PageSelect from "./pagination/PageSelect";
import "../styles/subjectsConfig.css";
import useFilter from "../hooks/useFilter";
import {
  getSubjectFields,
  parseSubjectFields,
} from "../constants/search_fields";

export default function SubjectsConfig(props) {
  const [subjects, setSubjects] = useState(null);
  const [courses, setCourses] = useState([]);

  const [maxPages, setMaxPages] = useState(1);

  const [changeColor, setChangeColor] = useState(false);
  const [newColor, setNewColor] = useState();
  const [newCode, setNewCode] = useState();
  const [changeCode, setChangeCode] = useState(false);
  const [newName, setNewName] = useState();
  const [changeName, setChangeName] = useState(false);
  const [newDescription, setNewDescription] = useState();
  const [changeDescription, setChangeDescription] = useState(false);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);
  const filteredSubjects = useFilter(
    searchParams,
    subjects,
    parseSubjectFields
  );

  const shortUUID = (uuid) => uuid.substring(0, 8);

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "100vw";
      document.getElementById("standard-modal").style.height = "100vw";
      document.getElementById("controlPanelContentContainer").style.overflow =
        "hidden";
    }
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

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(props.language.connectionAlert);
    setPopupIcon("error");
  };

  const fetchCourses = () => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.fetchCourses().then((cs) => {
        setCourses(cs.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const alertCreate = async () => {
    switchEditState(false);
    setPopupText(props.language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const createSubject = () => {
    switchEditState(false);
    let subject_code = document.getElementById("sj_subjectCode").value;
    let name = document.getElementById("sj_name").value;
    let desc = document.getElementById("sj_desc").value;
    let color = document.getElementById("sj_color").value;
    let sel_course = document.getElementById("course_chooser").value;

    let info = [subject_code, name, desc, color, sel_course];

    let valid = true;
    for (let i of info) {
      if (i.length < 2 && i === "-" && i === "") {
        valid = false;
        break;
      }
    }

    if (valid) {
      API.asynchronizeRequest(function () {
        SUBJECTSERVICE.createSubject({
          subject_code: subject_code,
          name: name,
          description: desc,
          color: color,
          course_id: sel_course,
        })
          .then((e) => {
            if (e) {
              fetchSubjectPage(1);
              setPopup(true);
              setPopupType("info");
              setPopupText(props.language.creationCompleted);
              switchSaveState(true);
            }
          })
          .catch(async (e) => {
            if (e) {
              await interceptExpiredToken(e);
              setPopup(true);
              setPopupText(props.language.creationFailed);
              setPopupType("error");
              switchSaveState(true);
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

  const confirmDeleteEvent = async (id) => {
    switchEditState(false);
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText(props.language.deleteAlert);
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(id);
  };

  const showDeleteError = () => {
    switchEditState(false);
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText(props.language.deleteFailed);
    setIsConfirmDelete(false);
  };

  const deleteSubject = (id) => {
    switchEditState(false);
    //eliminar sessiones + modal de aviso y mostrar las sessiones que se eliminarán
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.deleteSubject(id)
        .then(() => {
          fetchSubjectPage(1);
          setPopup(true);
          setPopupType("info");
          setPopupText(props.language.deleteAlertCompleted);
          switchSaveState(false);
          setIsConfirmDelete(false);
        })
        .catch(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            showDeleteError();
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
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
      let subject_code =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let color =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];

      subject_code.disabled = false;
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
        let subject_code =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];
        let color =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];

        subject_code.disabled = false;
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
        let code = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let name = e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let color = e.target.parentNode.parentNode.childNodes[4].childNodes[0];

        code.disabled = false;
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
    switchEditState(false);
    if (e.target.tagName === "svg") {
      let subject_code =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let color =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];

      let inputCode = document.getElementById("inputSubjectCode_" + s.id).value;
      let inputName = document.getElementById("inputName_" + s.id).value;
      let inputDescription = document.getElementById(
        "inputDescription_" + s.id
      ).value;
      let inputColor = document.getElementById("inputColor_" + s.id).value;

      let editCode, editTitle, editColor, editDescription;

      if (inputCode !== "" && inputCode !== s.code) {
        editCode = inputCode;
      } else editCode = s.code;

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
          subject_code: editCode,
          name: editTitle,
          description: editDescription,
          color: editColor,
          course_id: s.course_id,
        })
          .then((error) => {
            if (error) {
              fetchSubjectPage(1);
              let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
              buttonDelete.style.display = "block";
              let button = e.target.parentNode.parentNode.childNodes[1];
              button.style.display = "block";
              let checkButton = e.target.parentNode.parentNode.childNodes[2];
              checkButton.style.display = "none";
              let cancelButton = e.target.parentNode.parentNode.childNodes[3];
              subject_code.disabled = true;
              cancelButton.style.display = "none";
              name.disabled = true;
              color.disabled = true;
              description.disabled = true;

              setPopup(true);
              setPopupType("info");
              setPopupText(props.language.editAlertCompleted);
              switchSaveState(false);
              setIsConfirmDelete(false);
            }
          })
          .catch(async (error) => {
            if (error) {
              await interceptExpiredToken(e);
              setPopupText(props.language.editAlertFailed);
              setPopupIcon("error");
              switchSaveState(false);
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).then(async (error) => {
        if (error) {
          await interceptExpiredToken(e);
          connectionAlert();
        }
      });
    } else {
      if (e.target.tagName === "path") {
        let code =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];
        let color =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];

        let inputSubjectCode = document.getElementById(
          "inputSubjectCode_" + s.id
        ).value;
        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;
        let inputColor = document.getElementById("inputColor_" + s.id).value;

        let editCode, editTitle, editColor, editDescription;

        if (inputSubjectCode !== "" && inputSubjectCode !== s.subject_code) {
          editCode = inputSubjectCode;
        } else {
          editCode = s.subject_code;
        }

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
            subject_code: editCode,
            name: editTitle,
            description: editDescription,
            color: editColor,
            course_id: s.course_id,
          })
            .then((error) => {
              if (error) {
                fetchSubjectPage(1);
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
                code.disabled = true;
                name.disabled = true;
                description.disabled = true;
                color.disabled = true;
                setPopup(true);
                setPopupType("info");
                setPopupText(props.language.editAlertCompleted);
                switchSaveState(false);
                setIsConfirmDelete(false);
              }
            })
            .catch(async (error) => {
              if (error) {
                await interceptExpiredToken(e);
                setPopupText(props.language.editAlertFailed);
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
                setIsConfirmDelete(false);
              }
            });
        }).then(async (error) => {
          if (error) {
            await interceptExpiredToken(e);
            connectionAlert();
          }
        });
      } else {
        let subject_code =
          e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let name = e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let color = e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let inputCode = document.getElementById(
          "inputSubjectCode_" + s.id
        ).value;
        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;
        let inputColor = document.getElementById("inputColor_" + s.id).value;

        let editCode, editTitle, editColor, editDescription;

        if (inputCode !== "" && inputCode !== s.subject_code) {
          editCode = inputCode;
        } else {
          editCode = s.subject_code;
        }

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
            subject_code: editCode,
            name: editTitle,
            description: editDescription,
            color: editColor,
            course_id: s.course_id,
          })
            .then((error) => {
              if (error) {
                fetchSubjectPage(1);
                console.log(e.target.parentNode);
                let buttonDelete = e.target.parentNode.childNodes[0];
                buttonDelete.style.display = "block";
                let button = e.target.parentNode.childNodes[1];
                button.style.display = "block";
                let checkButton = e.target.parentNode.childNodes[2];
                checkButton.style.display = "none";
                let cancelButton = e.target.parentNode.childNodes[3];
                cancelButton.style.display = "none";
                subject_code.disabled = true;
                name.disabled = true;
                description.disabled = true;
                color.disabled = true;
                setPopup(true);
                setPopupType("info");
                setPopupText(props.language.editAlertCompleted);
                switchSaveState(false);
                setIsConfirmDelete(false);
              }
            })
            .catch(async (error) => {
              if (error) {
                await interceptExpiredToken(e);
                setPopupText(props.language.editAlertFailed);
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
                setIsConfirmDelete(false);
              }
            });
        }).then(async (error) => {
          if (error) {
            await interceptExpiredToken(e);
            connectionAlert();
          }
        });
      }
    }
  };

  const closeEditSubject = (e) => {
    if (e.target.tagName === "svg") {
      let subejct_code =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let color =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      subejct_code.disabled = true;
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
        let subject_code =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[1].childNodes[0];
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[3].childNodes[0];
        let color =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[4].childNodes[0];
        subject_code.disable = true;
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
        let subject_code =
          e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let name = e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let color = e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        subject_code.disable = true;
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

  const fetchSubjectPage = async (page) => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.pagedSubjects(page)
        .then((us) => {
          setMaxPages(us.data.total_pages);
          setSubjects(us.data.current_page);
          fetchCourses();
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
  };

  const handleChangeColor = (id) => {
    var content = document.getElementById("inputColor_" + id);
    setChangeColor(true);
    return content.value;
  };

  const handleChangeName = (id) => {
    var content = document.getElementById("inputName_" + id);
    setChangeName(true);
    return content.value;
  };

  const handleChangeDescription = (id) => {
    var content = document.getElementById("inputDescription_" + id);
    setChangeDescription(true);
    return content.value;
  };

  const handleChangeCode = (id) => {
    var content = document.getElementById("inputSubjectCode_" + id);
    setChangeCode(true);
    return content.value;
  };

  useEffect(() => {
    fetchSubjectPage(1);
    fetchCourses();

    setSearchParams({
      query: "",
      fields: getSubjectFields(props.language),
      selectedField: getSubjectFields(props.language)[0][0],
    });
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{props.language.subjectCode}</th>
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
                <input
                  type="text"
                  id="sj_subjectCode"
                  placeholder="Subject Code"
                />
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
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchSubjectPage(p)}
                maxPages={maxPages}
              />
            </div>
            <div className="subjects-table-info">
              <table className="eventList" style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>{props.language.code}</th>
                    <th>{props.language.subjectCode}</th>
                    <th>{props.language.name}</th>
                    <th>{props.language.description}</th>
                    <th>{props.language.color}</th>
                    <th>{props.language.linkedCourse}</th>
                    <th>{props.language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sj) => {
                    if (filteredSubjects !== null)
                      if (
                        filteredSubjects.length > 0 &&
                        !filteredSubjects.includes(sj)
                      )
                        return <></>;
                    return (
                      <tr key={sj.id}>
                        <td>
                          <input
                            disabled
                            type="text"
                            value={shortUUID(sj.id)}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputSubjectCode_${sj.id}`}
                            disabled
                            type="text"
                            value={changeCode ? newCode : sj.subject_code}
                            onChange={() => {
                              handleChangeCode(sj.id);
                            }}
                          />
                        </td>

                        <td>
                          <input
                            id={`inputName_${sj.id}`}
                            disabled
                            type="text"
                            value={changeName ? newName : sj.name}
                            onChange={() => {
                              handleChangeName(sj.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputDescription_${sj.id}`}
                            disabled
                            type="text"
                            value={
                              changeDescription
                                ? newDescription
                                : sj.description
                            }
                            onChange={() => {
                              handleChangeDescription(sj.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputColor_${sj.id}`}
                            disabled
                            type="color"
                            value={changeColor ? newColor : sj.color}
                            onChange={(e) => {
                              handleChangeColor(e, sj.id);
                            }}
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
          deleteSubject(idDelete);
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchSaveState();
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
