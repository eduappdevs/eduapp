import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as INSTITUTIONSERVICE from "../services/institution.service";
import * as COURSESERVICE from "../services/course.service";
import * as SUBJECTSERVICE from "../services/subject.service";
import Input from "./Input";
import "../styles/institutionConfig.css";
import StandardModal from "./modals/standard-modal/StandardModal";

export default function InstitutionConfig(props) {
  const [institutions, setInstitutions] = useState(null);
  const [editValue, setEditValue] = useState(false);
  const [nameValue, setNameValue] = useState();

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [popupType, setPopupType] = useState("");

  const fetchInstitutions = () => {
    API.asynchronizeRequest(function () {
      INSTITUTIONSERVICE.fetchInstitutions().then((i) => {
        setInstitutions(i.data);
      });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The institution not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(false);
      }
    });
  };

  const createInstitution = () => {
    let name = document.getElementById("i_name").value;
    if (name) {
      swapIcons(true);
      API.asynchronizeRequest(async function () {
        INSTITUTIONSERVICE.createInstitution({ name: name }).then((i) => {
          COURSESERVICE.createCourse({
            name: "General",
            institution_id: i.data.id,
          }).then((s) => {
            SUBJECTSERVICE.createSubject({
              name: "General",
              teacherInCharge: name,
              description: "Automated resource tab for all users in " + name,
              color: "#96ffb2",
              course_id: parseInt(s.data.id),
            }).then(() => {
              setTimeout(() => {
                swapIcons(true);
                fetchInstitutions();
              }, 500);
            });
          });
        });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The institution not be created, check if you have an internet connection."
          );
          setPopupIcon("error");
          switchSaveState(false);
        }
      });
    }
  };

  const showEditOptionInstitution = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];

      name.disabled = false;

      let button = e.target.parentNode.parentNode.childNodes[0];
      button.style.display = "none";
      let checkButton = e.target.parentNode.parentNode.childNodes[1];
      checkButton.style.display = "block";
      let cancelButton = e.target.parentNode.parentNode.childNodes[2];
      cancelButton.style.display = "block";
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];

        name.disabled = false;

        let button = e.target.parentNode.parentNode;
        button.style.display = "none";
        let checkButton =
          e.target.parentNode.parentNode.parentNode.childNodes[1];
        checkButton.style.display = "block";
        let cancelButton =
          e.target.parentNode.parentNode.parentNode.childNodes[2];
        cancelButton.style.display = "block";
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        name.disabled = false;

        let button = e.target.parentNode.childNodes[0];
        button.style.display = "none";
        let checkButton = e.target.parentNode.childNodes[1];
        checkButton.style.display = "block";
        let cancelButton = e.target.parentNode.childNodes[2];
        cancelButton.style.display = "block";
      }
    }
  };

  const editInstitution = async (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];

      let inputName = document.getElementById("inputName_" + s.id).value;

      let editName;

      if (inputName !== "" && inputName !== s.name) {
        editName = inputName;
      } else {
        editName = s.name;
      }

      API.asynchronizeRequest(function () {
        INSTITUTIONSERVICE.editInstitution({
          id: s.id,
          name: editName,
        })
          .then(() => {
            fetchInstitutions();
            let button = e.target.parentNode.parentNode.childNodes[0];
            button.style.display = "block";
            let checkButton = e.target.parentNode.parentNode.childNodes[1];
            checkButton.style.display = "none";
            let cancelButton = e.target.parentNode.parentNode.childNodes[2];
            cancelButton.style.display = "none";
            name.disabled = true;

            setPopup(true);
            setPopupType("info");
            setPopupText("The institution was edited successfully.");
          })
          .catch((e) => {
            console.log(e);
            if (e) {
              setPopupText(
                "The institution could not be edited, check if you entered the correct fields."
              );
              setPopupIcon("error");
              switchSaveState(false);
              setPopup(true);
            }
          });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The institution could not be edited, check if you have an internet connection."
          );
          setPopupIcon("error");
          switchSaveState(false);
        }
      });
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;

        let editName;

        if (inputName !== "" && inputName !== s.name) {
          editName = inputName;
        } else {
          editName = s.name;
        }

        API.asynchronizeRequest(function () {
          INSTITUTIONSERVICE.editInstitution({
            id: s.id,
            name: editName,
          })
            .then(() => {
              fetchInstitutions();

              let button =
                e.target.parentNode.parentNode.parentNode.childNodes[0];
              button.style.display = "block";
              let checkButton =
                e.target.parentNode.parentNode.parentNode.childNodes[1];
              checkButton.style.display = "none";
              let cancelButton =
                e.target.parentNode.parentNode.parentNode.childNodes[2];
              cancelButton.style.display = "none";
              name.disabled = true;

              setPopup(true);
              setPopupType("info");
              setPopupText("The institution was edited successfully.");
            })
            .catch((e) => {
              if (e) {
                setPopupText(
                  "The institution could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                setPopup(true);
              }
            });
        }).then((e) => {
          if (e) {
            setPopup(true);
            setPopupText(
              "The institution could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
            switchSaveState(false);
          }
        });
      } else {
        let email = e.target.parentNode.parentNode.childNodes[0].childNodes[0];
        let course = e.target.parentNode.parentNode.childNodes[1].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;

        let editName;

        if (inputName !== "" && inputName !== s.name) {
          editName = inputName;
        } else {
          editName = s.name;
        }

        API.asynchronizeRequest(function () {
          INSTITUTIONSERVICE.editInstitution({
            id: s.id,
            name: editName,
          })
            .then(() => {
              fetchInstitutions();

              let button = e.target.parentNode.childNodes[0];
              button.style.display = "block";
              let checkButton = e.target.parentNode.childNodes[1];
              checkButton.style.display = "none";
              let cancelButton = e.target.parentNode.childNodes[2];
              cancelButton.style.display = "none";
              email.disabled = true;
              course.disabled = true;

              setPopup(true);
              setPopupType("info");
              setPopupText("The institution was edited successfully.");
            })
            .catch((e) => {
              if (e) {
                setPopupText(
                  "The institution could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                setPopup(true);
              }
            });
        }).then((e) => {
          if (e) {
            setPopup(true);
            setPopupText(
              "The institution could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
          }
        });
      }
    }
  };

  const closeEditInstitutions = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];

      name.disabled = true;

      let button = e.target.parentNode.parentNode.childNodes[0];
      button.style.display = "block";
      let checkButton = e.target.parentNode.parentNode.childNodes[1];
      checkButton.style.display = "none";
      let cancelButton = e.target.parentNode.parentNode.childNodes[2];
      cancelButton.style.display = "none";
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[1].childNodes[0];

        name.disabled = true;

        let button = e.target.parentNode.parentNode.parentNode.childNodes[0];
        button.style.display = "block";
        let checkButton =
          e.target.parentNode.parentNode.parentNode.childNodes[1];
        checkButton.style.display = "none";
        let cancelButton =
          e.target.parentNode.parentNode.parentNode.childNodes[2];
        cancelButton.style.display = "none";
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];

        name.disabled = true;

        let button = e.target.parentNode.childNodes[1];
        button.style.display = "block";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "none";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "none";
      }
    }
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

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
    } else {
      document.getElementById("submit-loader").style.display = "none";
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <thead>
            <tr>
              <th>{props.language.code}</th>
              <th>{props.language.name}</th>
              <th>{props.language.actions}</th>
            </tr>
          </thead>
          <tbody>
            {institutions && institutions.length === 0 ? (
              <tr>
                <td>
                  <button onClick={createInstitution}>
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
                  </button>
                </td>
                <td>
                  <Input
                    name="i_name"
                    id="i_name"
                    placeholder={props.language.name}
                  />
                </td>
              </tr>
            ) : institutions ? (
              institutions.map((x) => {
                return (
                  <tr className="institution-entries" key={x.id}>
                    <td>
                      <input type="text" value={x.id} disabled />
                    </td>
                    <td>
                      <input
                        id={`inputName_${x.id}`}
                        type="text"
                        value={editValue === true ? nameValue : x.name}
                        onChange={(e) => {
                          setEditValue(true);
                          setNameValue(e.target.value);
                        }}
                        disabled
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
                        onClick={(e) => {
                          showEditOptionInstitution(e);
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
                        <div id="submit-loader" className="loader">
                          {props.language.loading} ...
                        </div>
                      </button>

                      <button
                        style={{ marginRight: "5px", display: "none" }}
                        onClick={(e) => {
                          editInstitution(e, x);
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
                        <div id="submit-loader" className="loader">
                          {props.language.loading} ...
                        </div>
                      </button>

                      <button
                        style={{ marginRight: "5px", display: "none" }}
                        onClick={(e) => {
                          closeEditInstitutions(e);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-x-lg"
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
            ) : null}
          </tbody>
        </table>
      </div>
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
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
