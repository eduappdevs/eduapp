/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useContext, useEffect, useState } from "react";
import asynchronizeRequest from "../API";
import * as USER_SERVICE from "../services/user.service";
import * as SUBJECTSERVICE from "../services/subject.service";
import ResourcesModal from "./modals/resources-modal/ResourcesModal";
import * as RESOURCESERVICES from "../services/resource.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import PageSelect from "./pagination/PageSelect";
import { interceptExpiredToken } from "../utils/OfflineManager";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import useFilter from "../hooks/useFilter";
import { getResourceFields } from "../constants/search_fields";
import "../styles/resourcesConfig.css";
import ExtraFields from "./ExtraFields";

export default function ResourcesConfig(props) {
  const [users, setUsers] = useState([]);
  const [subject, setSubject] = useState([]);
  const [resources, setResources] = useState([]);

  const [maxPages, setMaxPages] = useState(1);

  const [, setSearchParams] = useContext(SearchBarCtx);
  const filteredResources = useFilter(
    resources,
    null,
    RESOURCESERVICES.filterResources,
    getResourceFields(props.language)
  );

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

  const shortUUID = (uuid) => uuid.substring(0, 8);

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "100vw";
      document.getElementById("standard-modal").style.height = "100vh";
      document.getElementById("resources-modal-container").style.width =
        "100vw";
      document.getElementById("resources-modal-container").style.height =
        "100vh";
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

  const fetchUsers = () => {
    asynchronizeRequest(function () {
      USER_SERVICE.fetchUserInfos().then((res) => {
        setUsers(res.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchSubjects = async () => {
    await asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects().then((res) => {
        setSubject(res.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const showDeleteError = () => {
    switchEditState(false);
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText(props.language.deleteFailed);
    setIsConfirmDelete(false);
  };

  const deleteResources = async (id) => {
    asynchronizeRequest(function () {
      RESOURCESERVICES.deleteResources(id)
        .then((e) => {
          if (e) {
            fetchResourcesPage(1);
            setPopup(true);
            setPopupType("info");
            setPopupText(props.language.deleteAlertCompleted);
            setIsConfirmDelete(false);
          }
        })
        .catch((e) => {
          if (e) {
            showDeleteError();
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const confirmModalCreate = async () => {
    switchEditState(false);
    fetchResourcesPage(1);
    setShowModal(false);
    setShowCreateModal(false);
    setShowModalEdit(false);
    setPopup(true);
    setPopupType("info");
    setPopupText(props.language.creationCompleted);
  };
  const confirmModalEdit = async () => {
    switchEditState(false);
    setShowModal(false);
    setShowCreateModal(false);
    setShowModalEdit(false);
    fetchResourcesPage(1);
    setPopup(true);
    setPopupType("info");
    setPopupText(props.language.editAlertCompleted);
  };

  const alertCreate = async () => {
    switchEditState(false);
    setPopupText(props.language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const showModalsEdit = async (res) => {
    switchEditState(false);
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
    if (subject_id !== "" && subject_id !== res.subject.id) {
      editSubject = subject_id;
    } else {
      editSubject = res.subject.id;
    }

    if (editName !== null && editDescription !== null && editSubject !== null) {
      setResourceName(name);
      setResourceSubject(subject.find((s) => s.id === editSubject));
      setResourceDescription(description);
      setResourceAuthor(users.find((u) => u.user.email === author));

      setInfo(res);
      setShowModal(true);
      setShowModalEdit(true);
    } else {
      alertCreate();
    }
  };

  const showModals = async () => {
    let subject_id = document.getElementById("i_subject").value;
    let name = document.getElementById("i_name").value;
    let description = document.getElementById("i_description").value;
    let author = document.getElementById("i_author").value;

    if (name.length > 0 && author !== "--" && subject_id !== "--") {
      setResourceName(name);
      setResourceSubject(subject_id);
      setResourceDescription(description);
      setResourceAuthor(users.find((u) => u.user.id === author));
      setShowModal(true);
      setShowCreateModal(true);
    } else {
      alertCreate();
    }
  };

  const confirmDeleteResource = (id) => {
    switchEditState(false);
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText(props.language.deleteAlert);
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
      listSubject(subject.value);
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
        listSubject(subject.value);
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
        listSubject(subject.value);
      }
    }
  };

  const fetchResourcesPage = async (page) => {
    asynchronizeRequest(function () {
      RESOURCESERVICES.pagedResources(page)
        .then((us) => {
          setMaxPages(us.data.total_pages);
          setResources(us.data.current_page);
          fetchSubjects();
          fetchUsers();
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          console.error(err);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const listSubject = (sub) => {
    let list_subject = [];
    subject.map((s) => {
      if (s.id !== sub) {
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

  useEffect(() => fetchResourcesPage(1), []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getResourceFields(props.language),
      selectedField: getResourceFields(props.language)[0][0],
    });
  }, [props.language]);

  return (
    <>
      <div className="resources-main-container" id="scroll">
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
                  <option value="--">{props.language.chooseAuthor}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.user.id}>
                      {u.user.email}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select id="i_subject">
                  <option value="--">{props.language.chooseSubject}</option>
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
        <div className="notify-users">
          <PageSelect
            onPageChange={async (p) => fetchResourcesPage(p)}
            maxPages={maxPages}
          />
        </div>
        <div className="resources-table-info">
          {resources && resources.length !== 0 ? (
            <table style={{ marginTop: "15px" }} id="resources-config">
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
                  if (filteredResources !== null)
                    if (
                      filteredResources.find((fr) => r.id === fr.id) ===
                      undefined
                    )
                      return <Fragment key={r.id} />;
                  return (
                    <tr key={r.id}>
                      <td>
                        <input
                          type="text"
                          id={`inputID_${r.id}`}
                          disabled
                          value={shortUUID(r.id)}
                        />
                      </td>
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
                          value={r.user.email}
                        />
                      </td>
                      <td>
                        <select id={`inputSubjectID_${r.id}`} disabled>
                          <option value={r.subject.id}>{r.subject.name}</option>
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
                        <ExtraFields table="resources" id={r.id} />
                        <button
                          id="btn-delete-resources"
                          style={{ marginRight: "5px" }}
                          onClick={() => confirmDeleteResource(r.id)}
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
                          id="show-edit-option"
                          style={{ marginRight: "5px" }}
                          onClick={(e) => showEditOptionResource(e)}
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
                          id="btn-edit"
                          style={{ marginRight: "5px", display: "none" }}
                          onClick={() => showModalsEdit(r)}
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
                          id="btn-cancel-resources"
                          style={{ display: "none" }}
                          onClick={(e) => closeEditResource(e, r)}
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
      </div>
      <ResourcesModal
        create={showCreateModal}
        show={showModal}
        edit={showModalEdit}
        onCloseModal={() => {
          setShowModal(false);
          setShowCreateModal(false);
          setShowModalEdit(false);
          switchEditState(true);
        }}
        onAddModal={(c) => {
          if (c === "create") {
            confirmModalCreate();
            switchEditState(true);
          }
          if (c === "edit") {
            confirmModalEdit();
            switchEditState(true);
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
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
