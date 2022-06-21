import { useState, useEffect } from "react";
import StandardModal from "./modals/standard-modal/StandardModal";
import PageSelect from "./pagination/PageSelect";
import * as ROLE_SERVICE from "../services/role.service";
import "../styles/userRoles.css";

export default function UserRolesConfig({ language }) {
  const [showPerms, setShowPerms] = useState(false);
  const [roles, setRoles] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newPermsName, setNewPermsName] = useState("");
  const [newPermsDesc, setNewPermsDesc] = useState("");

  const [maxPages, setMaxPages] = useState(1);

  const [changesSaved, setChangesSaved] = useState(true);
  const [currentPermissions, setCurrentPermissions] = useState(null);
  const [justOpened, setJustOpened] = useState(false);

  const fetchRoles = async (page) => {
    const roles = await ROLE_SERVICE.pagedUserRoles(page);
    setMaxPages(roles.total_pages);
    setRoles(roles.current_page);
  };

  const FIELDS = [
    "institution",
    "course",
    "subjects",
    "resources",
    "sessions",
    "events",
    "teachers",
    "users",
    "roles",
    "tuitions",
    "jti_matchlist",
    "chat",
    "chat_participants",
    "message",
  ];

  const formatNameField = (field) => {
    switch (field) {
      case "jti_matchlist":
        return "JTI Matchlist";
      case "chat_participants":
        return "Chat Participants";
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
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
            <span>
              {isEditing
                ? changesSaved
                  ? "(Data saved.)"
                  : "(Saving, please don't close...)"
                : "Close To Discard Changes"}
            </span>
          </span>
          <table id="nice" className="permission-table">
            <thead>
              <tr>
                <th>
                  Permissions for{" "}
                  {isEditing ? currentPermissions.name : newPermsName}
                </th>
                <th>Read All</th>
                <th>Query</th>
                <th>View Self</th>
                <th>Write</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            {isEditing ? (
              <tbody>
                {FIELDS.map((field) => {
                  return (
                    <>
                      <tr key={field}>
                        <td>{formatNameField(field)}</td>
                        {currentPermissions[`perms_${field}`].map((perm, i) => (
                          <td key={i}>
                            <input
                              type="checkbox"
                              checked={perm}
                              onChange={(e) => handleDynamicUpdate(e, field, i)}
                            />
                          </td>
                        ))}
                      </tr>
                    </>
                  );
                })}
                <tr>
                  <td>App Views</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={currentPermissions.perms_app_views[0]}
                      onChange={(e) => handleDynamicUpdate(e, "app_views", 0)}
                    />
                    (Calendar)
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={currentPermissions.perms_app_views[1]}
                      onChange={(e) => handleDynamicUpdate(e, "app_views", 1)}
                    />
                    (Resources)
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={currentPermissions.perms_app_views[2]}
                      onChange={(e) => handleDynamicUpdate(e, "app_views", 2)}
                    />
                    (Chat)
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {FIELDS.map((field) => {
                  return (
                    <>
                      <tr key={field}>
                        <td>{formatNameField(field)}</td>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <td key={i}>
                            <input
                              type="checkbox"
                              id={`add_perm_${field}_${i}`}
                            />
                          </td>
                        ))}
                      </tr>
                    </>
                  );
                })}
                <tr>
                  <td>App Views</td>
                  <td>
                    <input type="checkbox" id="add_perm_view_cal" />
                    (Calendar)
                  </td>
                  <td>
                    <input type="checkbox" id="add_perm_view_res" />
                    (Resources)
                  </td>
                  <td>
                    <input type="checkbox" id="add_perm_view_chat" />
                    (Chat)
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
    if (newPermsName === "") return console.log("No name given");
    await ROLE_SERVICE.createRole({
      name: newPermsName,
      desc: newPermsDesc,
      perms_app_views: getPermsAppViews(),
      perms_chat: getPermsChecked("add_perm_chat"),
      perms_chat_participants: getPermsChecked("add_perm_chat_participants"),
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
    fetchRoles(1);
    setShowPerms(false);
  };

  const sendPermissionUpdate = async () => {
    if (!justOpened) {
      setChangesSaved(true);
    } else {
      setJustOpened(false);
    }
  };

  const deleteRole = async (id) => {
    await ROLE_SERVICE.deleteRole(id);
    fetchRoles(1);
  };

  const displayPermissions = (edit, id) => {
    setIsEditing(edit);
    setJustOpened(true);
    console.log(roles.find((role) => role.id === id));
    if (edit) setCurrentPermissions(roles.find((role) => role.id === id));
    else setCurrentPermissions([]);
    setShowPerms(true);
  };

  useEffect(() => {
    document.getElementsByClassName(
      "controlPanel-content-container"
    )[0].style.overflowY = "scroll";

    fetchRoles(1);

    return () => {
      document.getElementsByClassName(
        "controlPanel-content-container"
      )[0].style.overflowY = "hidden";
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      const searchTimeout = setTimeout(() => {
        sendPermissionUpdate(currentPermissions);
      }, 1250);
      return () => clearTimeout(searchTimeout);
    }
  }, [currentPermissions]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table>
          <thead>
            <tr>
              <th>{language.add}</th>
              <th>{language.description}</th>
              <th>{language.roleName}</th>
              <th>{language.roleSettings}</th>
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
              <td>
                <input
                  type="text"
                  placeholder={"Eduapp Owner"}
                  onChange={(e) => setNewPermsName(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={"Role Description"}
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
                        <button
                          style={{ marginRight: "5px" }}
                          onClick={() => deleteRole(role.id)}
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
        // show={showPopup}
        // iconFill={popupIcon}
        // type={popupType}
        // text={popupText}
        // isQuestion={isConfirmDelete}
        // onYesAction={() => {
        //   setPopup(false);
        //   deleteTeacher(idDelete, subjectDelete);
        // }}
        // onNoAction={() => {
        //   setPopup(false);
        //   switchEditState(true);
        // }}
        // onCloseAction={() => {
        //   setPopup(false);
        //   switchSaveState();
        //   switchEditState(true);
        // }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
