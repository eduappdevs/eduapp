/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext, Fragment } from "react";
import StandardModal from "./modals/standard-modal/StandardModal";
import PageSelect from "./pagination/PageSelect";
import * as ROLE_SERVICE from "../services/role.service";
import asynchronizeRequest from "../API";
import { interceptExpiredToken } from "../utils/OfflineManager";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import useFilter from "../hooks/useFilter";
import { getRoleFields } from "../constants/search_fields";
import "../styles/userRoles.css";
import { LoaderCtx } from "../hooks/LoaderContext";

export default function UserRolesConfig() {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [language] = useContext(LanguageCtx);

  const [showPerms, setShowPerms] = useState(false);
  const [roles, setRoles] = useState(null);
  const [hasDoneInitialFetch, setInitialFetch] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [newPermsName, setNewPermsName] = useState("");
  const [newPermsDesc, setNewPermsDesc] = useState("");

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);
  const filteredRoles = useFilter(
    roles,
    null,
    ROLE_SERVICE.filterRoles,
    getRoleFields(language)
  );

  const [changesSaved, setChangesSaved] = useState(true);
  const [currentPermissions, setCurrentPermissions] = useState(null);
  const [justOpened, setJustOpened] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupIcon, setPopupIcon] = useState("info");
  const [popupText, setPopupText] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const fetchRoles = async (page, order = null) => {
    try {
      const roles = await ROLE_SERVICE.pagedUserRoles(page, order);
      setMaxPages(roles.total_pages);
      setActualPage(roles.current_page);
      setRoles(roles.current_page);
    } catch (err) {
      await interceptExpiredToken(err);
    }
  };

  const FIELDS = [
    ["institution", language.institution],
    ["course", language.courses],
    ["subjects", language.subjects],
    ["resources", language.resources],
    ["sessions", language.sessions],
    ["session_chats", language.sessionChats],
    ["events", language.events],
    ["teachers", language.teachers],
    ["users", language.users],
    ["roles", language.roles],
    ["tuitions", language.enrollment],
    ["jti_matchlist", null],
    ["chat", language.chat],
    ["chat_participants", language.chatParticipants],
    ["message", language.chatMessages],
  ];

  const manageSaveText = () => {
    if (isEditing !== null) {
      if (isEditing) {
        if (changesSaved) return `(${language.dataSaved})`;
        else return `(${language.dataSaving})`;
      } else return `(${language.close2Discard})`;
    } else return `(${language.dataSaveError})`;
  };

  const formatNameField = (field) => {
    switch (field[0]) {
      case "jti_matchlist":
        return "JTI Matchlist";
      default:
        return field[1];
    }
  };

  const handleDynamicUpdate = (e, field, i) => {
    setChangesSaved(false);
    let copy = { ...currentPermissions };
    copy[`perms_${field}`][i] = e.target.checked;
    setCurrentPermissions(copy);
  };

  const Permissions = () => {
    if (currentPermissions !== null) {
      return (
        <div
          style={{
            display: showPerms ? "block" : "none",
            marginTop: "20px",
          }}
        >
          <span className="close-perms">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-circle-fill"
              viewBox="0 0 16 16"
              onClick={() => {
                setShowPerms(false);
                setCurrentPermissions(null);
              }}
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
            <span>{manageSaveText()}</span>
          </span>
          <table id="nice" className="permission-table">
            <thead>
              <tr>
                <th>
                  {language.permissionsFor}&nbsp;
                  {isEditing ? currentPermissions.name : newPermsName}
                </th>
                <th>{language.readAll}</th>
                <th>{language.query}</th>
                <th>{language.viewSelf}</th>
                <th>{language.write}</th>
                <th>{language.update}</th>
                <th>{language.delete}</th>
              </tr>
            </thead>
            {isEditing ? (
              <tbody>
                {FIELDS.map((field) => {
                  return (
                    <>
                      <tr key={field[0]}>
                        <td>{formatNameField(field)}</td>
                        {currentPermissions[`perms_${field[0]}`].map(
                          (perm, i) => (
                            <td key={i}>
                              <input
                                type="checkbox"
                                checked={perm}
                                onChange={(e) =>
                                  handleDynamicUpdate(e, field[0], i)
                                }
                              />
                            </td>
                          )
                        )}
                      </tr>
                    </>
                  );
                })}
                <tr>
                  <td>{language.appViews}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={currentPermissions.perms_app_views[0]}
                      onChange={(e) => handleDynamicUpdate(e, "app_views", 0)}
                    />
                    ({language.calendar})
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={currentPermissions.perms_app_views[1]}
                      onChange={(e) => handleDynamicUpdate(e, "app_views", 1)}
                    />
                    ({language.resources})
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={currentPermissions.perms_app_views[2]}
                      onChange={(e) => handleDynamicUpdate(e, "app_views", 2)}
                    />
                    ({language.chat})
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {FIELDS.map((field) => {
                  return (
                    <>
                      <tr key={field[0]}>
                        <td>{formatNameField(field)}</td>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <td key={i}>
                            <input
                              type="checkbox"
                              id={`add_perm_${field[0]}_${i}`}
                            />
                          </td>
                        ))}
                      </tr>
                    </>
                  );
                })}
                <tr>
                  <td>{language.appViews}</td>
                  <td>
                    <input type="checkbox" id="add_perm_view_cal" />(
                    {language.calendar})
                  </td>
                  <td>
                    <input type="checkbox" id="add_perm_view_res" />(
                    {language.resources})
                  </td>
                  <td>
                    <input type="checkbox" id="add_perm_view_chat" />(
                    {language.chat})
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const prepareDialog = () => {
    document.getElementsByClassName(
      "controlPanel-content-container"
    )[0].scrollTop = 0;
    document.getElementsByClassName(
      "controlPanel-content-container"
    )[0].style.overflowY = "hidden";
  };

  const showConfirmDelete = (id) => {
    setDeleteId(id);
    setIsConfirmDelete(true);
    setPopupIcon("warning");
    setPopupText(language.confirmDeleteRole);
    prepareDialog();
    setShowPopup(true);
  };

  const showDeleteDialog = () => {
    setIsConfirmDelete(false);
    setPopupIcon("info");
    setPopupText(language.roleDeleted);
    prepareDialog();
    setShowPopup(true);
  };

  const showDeleteError = () => {
    setDeleteId(null);
    setIsConfirmDelete(false);
    setPopupIcon("error");
    setPopupText(language.deleteAlertFailed);
    prepareDialog();
    setShowPopup(true);
  };

  const showCreationError = () => {
    setIsConfirmDelete(false);
    setPopupIcon("error");
    setPopupText(language.creationAlert);
    prepareDialog();
    setShowPopup(true);
  };

  const showCreationDialog = () => {
    setIsConfirmDelete(false);
    setPopupIcon("info");
    setPopupText(language.creationCompleted);
    prepareDialog();
    setShowPopup(true);
  };

  const showConnectionError = () => {
    setIsConfirmDelete(false);
    setPopupIcon("error");
    setPopupText(language.connectionError);
    prepareDialog();
    setShowPopup(true);
  };

  const getPermsChecked = (field) => {
    let perm = [];
    let cp;
    for (let i = 0; i < 6; i++) {
      cp = document.getElementById(`${field}_${i}`);
      perm.push(cp === null ? false : cp.checked);
    }
    return perm;
  };

  const getPermsAppViews = () => {
    const addFields = ["cal", "res", "chat"];
    let cp;
    let perm = [];
    for (let f of addFields) {
      cp = document.getElementById(`add_perm_view_${f}`);
      perm.push(cp === null ? false : cp.checked);
    }
    return perm;
  };

  const createRole = async () => {
    if (newPermsName === "") return showCreationError();
    asynchronizeRequest(async () => {
      try {
        await ROLE_SERVICE.createRole({
          name: newPermsName,
          desc: newPermsDesc,
          perms_app_views: getPermsAppViews(),
          perms_chat: getPermsChecked("add_perm_chat"),
          perms_chat_participants: getPermsChecked(
            "add_perm_chat_participants"
          ),
          perms_course: getPermsChecked("add_perm_course"),
          perms_events: getPermsChecked("add_perm_events"),
          perms_institution: getPermsChecked("add_perm_institution"),
          perms_jti_matchlist: getPermsChecked("add_perm_jti_matchlist"),
          perms_message: getPermsChecked("add_perm_message"),
          perms_resources: getPermsChecked("add_perm_resources"),
          perms_roles: getPermsChecked("add_perm_roles"),
          perms_sessions: getPermsChecked("add_perm_sessions"),
          perms_subjects: getPermsChecked("add_perm_subjects"),
          perms_teachers: getPermsChecked("add_perm_teachers"),
          perms_tuitions: getPermsChecked("add_perm_tuitions"),
          perms_users: getPermsChecked("add_perm_users"),
        });
        fetchRoles(actualPage);
        setShowPerms(false);
        showCreationDialog();
      } catch (err) {
        await interceptExpiredToken(err);
      }
    }).then((err) => {
      if (err) showConnectionError();
    });
  };

  const sendPermissionUpdate = async () => {
    if (!justOpened) {
      asynchronizeRequest(async () => {
        try {
          await ROLE_SERVICE.updateRole(currentPermissions);
          setChangesSaved(true);
        } catch (err) {
          await interceptExpiredToken(err);
          setIsEditing(null);
        }
      });
    } else {
      setJustOpened(false);
    }
  };

  const deleteRole = async () => {
    if (deleteId === null) return;
    asynchronizeRequest(async () => {
      try {
        await ROLE_SERVICE.deleteRole(deleteId);
        fetchRoles(actualPage);
        setDeleteId(null);
        showDeleteDialog();
      } catch (err) {
        await interceptExpiredToken(err);
        showDeleteError();
      }
    }).then((err) => {
      if (err) showConnectionError();
    });
  };

  const displayPermissions = (edit, id) => {
    setIsEditing(edit);
    setJustOpened(true);
    if (edit) setCurrentPermissions(roles.find((role) => role.id === id));
    else setCurrentPermissions([]);
    setShowPerms(true);
  };

  useEffect(() => {
    document.getElementsByClassName(
      "controlPanel-content-container"
    )[0].style.overflowY = "scroll";

    fetchRoles(1);
    setInitialFetch(true);

    return () => {
      document.getElementsByClassName(
        "controlPanel-content-container"
      )[0].style.overflowY = "hidden";
    };
  }, []);

  useEffect(() => {
    if (isEditing && currentPermissions !== null) {
      const searchTimeout = setTimeout(() => {
        sendPermissionUpdate(currentPermissions);
      }, 1500);
      return () => clearTimeout(searchTimeout);
    }
  }, [currentPermissions]);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getRoleFields(language),
      selectedField: getRoleFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  useEffect(() => {
    if (hasDoneInitialFetch) {
      fetchRoles(1, {
        field: searchParams.selectedField,
        order: searchParams.order,
      });
    }
  }, [searchParams.order]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{language.description}</th>
              <th>{language.roleName}</th>
              <th>{language.roleSettings}</th>
              <th>{language.add}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {language.add}:
              </td>
              <td>
                <input
                  type="text"
                  placeholder={language.name}
                  onChange={(e) => setNewPermsName(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={language.description}
                  onChange={(e) => setNewPermsDesc(e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => displayPermissions(false, null)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-list list-svg"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </button>
              </td>
              <td className="action-column">
                <button onClick={async () => await createRole()}>
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
            </tr>
          </tbody>
        </table>
        <Permissions />
        {roles && roles.length > 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchRoles(p)}
                maxPages={maxPages}
              />
            </div>
            <table style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>{language.roleName}</th>
                  <th>{language.roleSettings}</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => {
                  if (filteredRoles !== null)
                    if (
                      filteredRoles.find((fr) => role.id === fr.id) ===
                      undefined
                    )
                      return <Fragment key={role.id} />;
                  return (
                    <tr key={role.id}>
                      <td>
                        <input
                          type="text"
                          value={role.name}
                          disabled
                          onChange={() => null}
                        />
                      </td>
                      <td>
                        <button
                          style={{ marginRight: "5px" }}
                          onClick={() => displayPermissions(true, role.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-list list-svg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                            />
                          </svg>
                        </button>
                        <button onClick={() => showConfirmDelete(role.id)}>
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : null}
      </div>
      <StandardModal
        show={showPopup}
        type={popupIcon}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setShowPopup(false);
          deleteRole();
        }}
        onNoAction={() => {
          setShowPopup(false);
          document.getElementsByClassName(
            "controlPanel-content-container"
          )[0].style.overflowY = "scroll";
        }}
        onCloseAction={() => {
          setShowPopup(false);
          document.getElementsByClassName(
            "controlPanel-content-container"
          )[0].style.overflowY = "scroll";
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
