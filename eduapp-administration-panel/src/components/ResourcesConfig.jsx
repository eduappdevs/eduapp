import React, { useEffect, useState } from "react";
import asynchronizeRequest from "../API";
import * as USER_SERVICE from "../services/user.service";
import * as SUBJECTSERVICE from "../services/subject.service";
import "../styles/resourcesConfig.css";
import ResourcesModal from "./modals/resources-modal/ResourcesModal";
import * as RESOURCESERVICES from "../services/resource.service";
import StandardModal from "./modals/standard-modal/StandardModal";

export default function ResourcesConfig(props) {
  const [users, setUsers] = useState([]);
  const [subject, setSubject] = useState([]);
  const [resources, setResources] = useState([]);

  const [resourceName, setResourceName] = useState();
  const [resourceSubject, setResourceSubject] = useState();
  const [resourceDescription, setResourceDescription] = useState();
  const [resourceAuthor, setResourceAuthor] = useState();
  const [subjectEdit, setSubjectEdit] = useState([]);
  const [info, setInfo] = useState();

  const [newName] = useState();
  const [newDescription] = useState();
  const [changeName, setChangeName] = useState(false);
  const [changeDescription, setChangeDescription] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const fetchUsers = () => {
    asynchronizeRequest(function () {
      USER_SERVICE.fetchUserInfos().then((res) => {
        setUsers(res.data);
      });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The users could not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
      }
    });
  };

  const fetchResources = () => {
    asynchronizeRequest(function () {
      RESOURCESERVICES.fetchResources().then((res) => {
        setResources(res.data);
        fetchSubjects();
        fetchUsers();
      });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The resources could not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
      }
    });
  };

  const fetchSubjects = async () => {
    await asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects().then((res) => {
        setSubject(res.data);
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

  const showDeleteError = () => {
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText("The session could not be deleted.");
    setIsConfirmDelete(false);
  };

  const deleteResources = async (id) => {
    asynchronizeRequest(function () {
      RESOURCESERVICES.deleteResources(id)
        .then((e) => {
          if (e) {
            fetchResources();
          }
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
          "The resources could not be deleted, check if you have an internet connection."
        );
        setPopupIcon("error");
      }
    });
  };

  const confirmModalCreate = async () => {
    setShowModal(false);
    setShowCreateModal(false);
    setShowModalEdit(false);
    fetchResources();
    setPopup(true);
    setPopupType("info");
    setPopupText("The resources was created successfully.");
    document.getElementById("controlPanelContentContainer").style.overflow =
      "scroll";
  };
  const confirmModalEdit = async () => {
    setShowModal(false);
    setShowCreateModal(false);
    setShowModalEdit(false);
    fetchResources();
    setPopup(true);
    setPopupType("info");
    setPopupText("The resources was edit successfully.");
    document.getElementById("controlPanelContentContainer").style.overflow =
      "scroll";
  };

  // const switchSaveState = (state) => {
  //   if (state) {
  //     document.getElementById("controlPanelContentContainer").style.overflow =
  //       "scroll";
  //     document
  //       .getElementById("commit-loader-2")
  //       .classList.remove("commit-loader-hide");
  //     document.getElementById("add-svg").classList.add("commit-loader-hide");
  //   } else {
  //     document.getElementById("controlPanelContentContainer").style.overflow =
  //       "hidden";
  //     document.getElementById("add-svg").classList.remove("commit-loader-hide");
  //     document
  //       .getElementById("commit-loader-2")
  //       .classList.add("commit-loader-hide");
  //   }
  // };

  const alertCreate = async () => {
    setPopupText("Required information is missing.");
    setPopupType("error");
    setPopup(true);
  };

  const showModalsEdit = async (res) => {
    document.getElementById("controlPanelContentContainer").style.overflow =
      "hidden";
    let subject_id = document.getElementById(`inputSubjectID_${res.id}`).value;
    let name = document.getElementById(`inputName_${res.id}`).value;
    let description = document.getElementById(
      `inputDescription_${res.id}`
    ).value;
    let author = document.getElementById(`inputAuthor_${res.id}`).value;

    let editName, editDescription, editSubject;

    if (name !== "" && name !== res.name) {
      editName = name;
    } else {
      editName = res.name;
    }
    if (description !== "" && description !== res.description) {
      editDescription = description;
    } else {
      editDescription = res.description;
    }
    if (subject_id !== "" && subject_id !== res.subject_id) {
      editSubject = subject_id;
    } else {
      editSubject = res.subject_id;
    }

    if (editName !== null && editDescription !== null && editSubject !== null) {
      setResourceName(name);
      setResourceSubject(subject_id);
      setResourceDescription(description);
      setResourceAuthor(author);
      setInfo(res);
      setShowModal(true);
      setShowModalEdit(true);
    } else {
      alertCreate();
    }
  };

  const showModals = async () => {
    document.getElementById("controlPanelContentContainer").style.overflow =
      "hidden";
    let subject_id = document.getElementById("i_subject").value;
    let name = document.getElementById("i_name").value;
    let description = document.getElementById("i_description").value;
    let author = document.getElementById("i_author").value;

    if (
      name !== null &&
      name !== "" &&
      description !== null &&
      author !== null &&
      author !== props.language.chooseAuthor &&
      subject_id !== null &&
      subject_id !== props.language.chooseSubject
    ) {
      setResourceName(name);
      setResourceSubject(subject_id);
      setResourceDescription(description);
      setResourceAuthor(author);
      setShowModal(true);
    } else {
      alertCreate();
    }
  };

  const confirmDeleteResource = (id) => {
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText("Are you sure you want to delete this resources?");
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(id);
  };

  const closeEditResource = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let resources =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      name.disabled = true;
      description.disabled = true;
      resources.disabled = true;
      subject.disabled = true;
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
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[5].childNodes[0];

        name.disabled = true;
        description.disabled = true;
        resources.disabled = true;
        subject.disabled = true;
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
        let subject =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];

        name.disabled = true;
        description.disabled = true;
        resources.disabled = true;
        subject.disabled = true;
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

  const showEditOptionResource = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];

      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];

      name.disabled = false;
      description.disabled = false;
      subject.disabled = false;

      let buttonDelete = e.target.parentNode.parentNode.childNodes[1];
      buttonDelete.style.display = "none";
      let button = e.target.parentNode.parentNode.childNodes[0];
      button.style.display = "none";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "block";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "block";
      listSubject(subject.value.split("_")[1]);
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];

        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];

        name.disabled = false;
        description.disabled = false;
        subject.disabled = false;

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
        listSubject(subject.value.split("_")[1]);
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];

        name.disabled = false;
        description.disabled = false;
        subject.disabled = false;
        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "none";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "none";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "block";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "block";
        listSubject(subject.value.split("_")[1]);
      }
    }
  };

  const listSubject = (sub) => {
    let list_subject = [];
    subject.map((s) => {
      if (s.id !== parseInt(sub)) {
        list_subject.push(s);
      }
      return true;
    });
    setSubjectEdit(list_subject);
  };

  const handleChangeName = (id) => {
    setChangeName(true);
    return document.getElementById(`inputName_${id}`).value;
  };

  const handleChangeDescription = (id) => {
    setChangeDescription(true);
    return document.getElementById(`inputDescription_${id}`).value;
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-containe">
        <table>
          <thead>
            <tr>
              <th>{props.language.name}</th>
              <th>{props.language.description}</th>
              <th>{props.language.author}</th>
              <th>{props.language.subjects}</th>
              <th>{props.language.files}</th>
            </tr>
          </thead>
          <tbody>
            <tr key={`newResource`}>
              <td>
                <input
                  name="i_name"
                  id="i_name"
                  type="text"
                  placeholder={props.language.name}
                />
              </td>
              <td>
                <input
                  name="i_description"
                  id="i_description"
                  type="text"
                  placeholder={props.language.description}
                />
              </td>
              <td>
                <select id="i_author">
                  <option defaultValue="--">
                    {props.language.chooseAuthor}
                  </option>
                  {users.map((u) => (
                    <option key={u.id} value={u.user.email}>
                      {u.user.email}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select id="i_subject">
                  <option defaultValue={props.language.chooseSubject}>
                    {props.language.chooseSubject}
                  </option>
                  {subject.map((s) => (
                    <option key={s.id} value={`${s.name}_${s.id}`}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => {
                    showModals();
                    setShowCreateModal(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-bar-up"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {resources && resources.length !== 0 ? (
          <table style={{ marginTop: "50px" }}>
            <thead>
              <tr>
                <th>{props.language.code}</th>
                <th>{props.language.name}</th>
                <th>{props.language.description}</th>
                <th>{props.language.author}</th>
                <th>{props.language.subjects}</th>
                <th>{props.language.actions}</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((r) => {
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      <input
                        type="text"
                        id={`inputName_${r.id}`}
                        disabled
                        value={changeName === false ? r.name : newName}
                        onChange={() => {
                          handleChangeName(r.id);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id={`inputDescription_${r.id}`}
                        disabled
                        value={
                          changeDescription === false
                            ? r.description
                            : newDescription
                        }
                        onChange={() => {
                          handleChangeDescription(r.id);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id={`inputAuthor_${r.id}`}
                        disabled
                        value={r.createdBy}
                      />
                    </td>
                    <td>
                      <select id={`inputSubjectID_${r.id}`} disabled>
                        <option
                          defaultValue={r.subject_id}
                          value={`${r.subject.name}_${r.subject_id}`}
                        >
                          {r.subject.name}
                        </option>
                        {subjectEdit.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
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
                          confirmDeleteResource(r.id);
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
                          showEditOptionResource(e);
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
                        onClick={() => {
                          showModalsEdit(r);
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
                          closeEditResource(e, r);
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
        ) : null}
      </div>
      <ResourcesModal
        create={showCreateModal}
        show={showModal}
        edit={showModalEdit}
        onCloseModal={() => {
          setShowModal(false);
          setShowCreateModal(false);
          setShowModalEdit(false);
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        onAddModal={(c) => {
          if (c === "create") {
            confirmModalCreate();
          }
          if (c === "edit") {
            confirmModalEdit();
          }
        }}
        language={props.language}
        subject={resourceSubject}
        name={resourceName}
        description={resourceDescription}
        author={resourceAuthor}
        info={info}
      />
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setPopup(false);
          deleteResources(idDelete);
          setIsConfirmDelete(false);
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        onCloseAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
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
