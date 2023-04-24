/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useCallback, useEffect, useState, useMemo, useRef } from "react";
import * as USERSERVICE from "../services/user.service";
import * as SUBJECTSUSERSSERVICE from "../services/enrollSubjectConfig.service";
import * as ENROLLSERVICE from "../services/enrollConfig.service";
import * as API from "../API";
import StandardModal from "./modals/standard-modal/StandardModal";
import ExtraFields from "./ExtraFields";
import * as COURSESERVICE from "../services/course.service";
import * as CHATSERVICE from "../services/chat.service";
import * as ROLESERVICE from "../services/role.service";
import { getOfflineUser, interceptExpiredToken } from "../utils/OfflineManager";
import EncryptionUtils from "../utils/EncryptionUtils";
import PageSelect from "./pagination/PageSelect";
import { useContext } from "react";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { getUserFields } from "../constants/search_fields";
import useFilter from "../hooks/useFilter";
import { LanguageCtx } from "../hooks/LanguageContext";
import { LoaderCtx } from "../hooks/LoaderContext";

const system_user_name = "eduapp_system";
export default function UserConfig() {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [language] = useContext(LanguageCtx);

  const [users, setUsers] = useState(null);
  // const [hasDoneInitialFetch, setInitialFetch] = useState(false);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const userBeforeEditing = useRef(null);

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);

  const [userPermRoles, setUserPermRoles] = useState([]);
  const [allSelected, setAllSelected] = useState(true);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const [notifyModal, setNotifyModal] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");

  const shortUUID = useCallback((uuid) => uuid.substring(0, 8), []);

  const switchEditState = useCallback((state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll")?.scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "101%";
      document.getElementById("standard-modal").style.height = "101%";
      document.getElementById("controlPanelContentContainer").scrollLeft = 0;
      document.getElementById("controlPanelContentContainer").style.overflow = "hidden";
    }
  }, []);

  const finalizedEdit = useCallback((type, icon, text, confirmDel) => {
    fetchUserPage(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  }, [actualPage]);

  const finalizedCreate = useCallback((type, icon, txt, confirmDel) => {
    fetchUserPage(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(txt);
  }, [actualPage]);

  const finalizedDelete = useCallback((type, icon, confirmDel, text) => {
    switchEditState(false);
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchUserPage(actualPage);
  }, [actualPage]);

  const connectionAlert = useCallback(async () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  }, [language]);

  const fetchUserPage = useCallback(async (page, order = null, searchParams) => {
    API.asynchronizeRequest(() => {
      setLoadingParams({ loading: true });
      USERSERVICE.pagedUserInfos(page, order, searchParams)
        .then((us) => {
          setActualPage(us.data.page);
          setMaxPages(us.data.total_pages);
          setUsers(us.data.current_page);
          setLoadingParams({ loading: false });
        })
        .catch(async (err) => {
          await interceptExpiredToken(err)
          setLoadingParams({ loading: false });
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const fetchRoles = useCallback(() => {
    API.asynchronizeRequest(function () {
      ROLESERVICE.fetchRoles()
        .then((roles) => {
          setUserPermRoles(roles);
        })
        .catch((err) => {
          // await interceptExpiredToken(err);
          // console.error(err);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    })
  }, []);

  const alertCreate = useCallback(async () => {
    switchEditState(false);
    finalizedCreate("error", true, language.creationFailed, false);
  }, [language]);

  const createUser = useCallback((e) => {
    switchEditState(false);

    let email = document.getElementById("u_email").value;
    let pass = document.getElementById("u_pass").value;
    let role = document.getElementById("u_role").value;

    if (email && pass) {
      API.asynchronizeRequest(async function () {
        setLoadingParams({ loading: true });
        USERSERVICE.createUser({
          requester_id: getOfflineUser().user.id,
          email: email,
          password: pass,
          user_role: role,
        })
          .then(async (res) => {
            if (res) {
              document.getElementById("u_email").value = null;
              document.getElementById("u_pass").value = null;
              await userEnroll(res.data.user.id);
              finalizedCreate("info", true, language.creationCompleted, false);
            }
            setLoadingParams({ loading: false });
          })
          .catch(async (error) => {
            alertCreate();
            await interceptExpiredToken(error);
            setLoadingParams({ loading: false });
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
  }, [language]);

  const confirmDeleteUser = useCallback(async (id) => {
    switchEditState(false);
    finalizedDelete("warning", true, true, language.deleteAlert);
    setIdDelete(id);
  }, [language]);

  const deleteUser = useCallback(async (id) => {
    let systemUser = (await USERSERVICE.fetchSystemUser()).data;
    if (id !== systemUser.user.id) {
      if (id !== getOfflineUser().user.id) {
        API.asynchronizeRequest(function () {
          setLoadingParams({ loading: true });
          USERSERVICE.deleteUser(id)
            .then((err) => {
              if (err) {
                finalizedDelete(
                  "info",
                  true,
                  false,
                  language.deleteAlertCompleted
                );
              }
              setLoadingParams({ loading: false });
            })
            .catch(async (err) => {
              if (err) {
                finalizedDelete(
                  "error",
                  true,
                  false,
                  language.deleteAlertFailed
                );
                await interceptExpiredToken(err);
              }
              setLoadingParams({ loading: false });
            });
        }).then(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            connectionAlert();
          }
        });
      } else {
        alert("Cannot delete yourself.");
      }
    } else {
      alert("Cannot delete system user.");
    }
  }, [language]);

  const toggleEditRow = (e, disable = false) => {
    let editableFields = 2;
    while (editableFields) {
      e.target.parentNode.parentNode.childNodes[
        editableFields
      ].childNodes[0].disabled = disable;
      editableFields -= 1;
    }
    e.target.parentNode.querySelectorAll('button.editing').forEach(element => {
      element.style.display = (disable ? 'none' : 'block');
    });
    e.target.parentNode.querySelectorAll('button:not(.editing)').forEach(element => {
      element.style.display = (disable ? 'block' : 'none');
    });
  }

  const editUser = (e, s) => {
    switchEditState(false);

    let inputName = document.getElementById("inputName_" + s.user.id).value;
    let inputEmail = document.getElementById("inputEmail_" + s.user.id).value;

    let editName, editEmail;

    if (inputName !== "" && inputName !== s.user_name) {
      editName = inputName;
    } else {
      editName = s.user_name;
    }

    if (inputEmail !== "" && inputEmail !== s.email) {
      editEmail = inputEmail;
    } else {
      editEmail = s.user.email;
    }

    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      USERSERVICE.editUser({
        id: s.id,
        user_id: s.user.id,
        user_name: editName,
        profile_image: s.profile_image,
        teaching_list: s.teaching_list,
        isLoggedWithGoogle: s.isLoggedWithGoogle,
        googleid: s.googleid,
      })
        .then((x) => {
          if (x) {
            finalizedEdit("info", true, language.editAlertCompleted, false);
            toggleEditRow(e, true);
          }
          setLoadingParams({ loading: false });
        })
        .catch((e) => {
          if (e) {
            finalizedEdit("error", true, language.editAlertFailed, false);
          }
          setLoadingParams({ loading: false });
        });
    }).then((e) => {
      if (e) {
        connectionAlert();
      }
    });
  };

  const closeEditUser = (e, index) => {
    toggleEditRow(e, true);

    let auxUsers = [...users];
    auxUsers[index] = { ...userBeforeEditing.current };
    setUsers(auxUsers);
  };

  const showEditOptionUser = (e, index) => {
    toggleEditRow(e, false);

    userBeforeEditing.current = { ...users[index] };
  };

  const userEnroll = useCallback(async (uId) => {
    const payload = new FormData();
    payload.append(
      "course_id",
      (await COURSESERVICE.fetchGeneralCourse()).data.id
    );
    payload.append("user_id", uId);

    API.asynchronizeRequest(function () {
      // setLoadingParams({ loading: true });
      ENROLLSERVICE.createTuition(payload);
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        setPopup(true);
        setPopupText(
          "The new user could not be published, check if you have an internet connection."
        );
        setPopupIcon("error");
        // switchSaveState(false);
      }
      // setLoadingParams({ loading: false });
    })
    // .catch(() => {
    //   setLoadingParams({ loading: false });
    // });
  }, []);

  const notifyUsers = useCallback(async () => {
    let systemUser = (await USERSERVICE.fetchSystemUser()).data;
    for (let u of document.getElementsByName("user-check")) {
      if (u.checked) {
        let uid = u.id.split("_")[1];
        let chat_info;
        try {
          chat_info = await CHATSERVICE.fetchUserNotifsChat(uid);
          if (chat_info.data.chat_participants.length == 1) {
            await CHATSERVICE.deleteChat(chat_info.data.id);
            throw new Error("Chat with only one participant");
          }
        } catch (err) {
          let chat_id = await CHATSERVICE.createCompleteChat({
            base: {
              chat_name: "private_chat_system_" + uid,
              isGroup: false,
              isReadOnly: true,
            },
            participants: {
              user_ids: [uid, systemUser.user.id],
            },
          });
          chat_info = await CHATSERVICE.findChatById(chat_id);
        }

        await CHATSERVICE.createMessage({
          chat_base_id: chat_info.data.id,
          user_id: systemUser.user.id,
          message: EncryptionUtils.encrypt(
            notifyMsg,
            atob(chat_info.data.public_key)
          ),
          send_date: new Date().toISOString(),
        });
        u.checked = false;
        console.log("Sent notification.");
      }
    }
  }, [notifyMsg]);

  const selectAll = useCallback(() => {
    setAllSelected(!allSelected);
    for (let c of document.getElementsByName("user-check"))
      c.checked = allSelected;
  }, [allSelected]);

  const handleChange = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    const newUsers = [...users];
    newUsers[index][inputName] = newValue;
    setUsers(newUsers);
  }

  const memoizedUsers = () => {
    return (
      <>
        {users && users.map((u, index) => {
          let user = u.user.last_sign_in_at;
          return (
            <tr key={u.id}>
              <td>
                <input
                  id={`check_${u.user.id}`}
                  type={"checkbox"}
                  disabled={u.user.username === system_user_name}
                  name={
                    u.user.username === system_user_name
                      ? null
                      : "user-check"
                  }
                />
              </td>
              <td>{shortUUID(u.user.id)}</td>
              <td>
                <input
                  id={`inputName_${u.user.id}`}
                  name="user_name"
                  disabled
                  type="text"
                  value={u.user_name}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputEmail_${u.user.id}`}
                  name="user[email]"
                  disabled
                  type="text"
                  value={u.user.email}
                  onChange={() => handleChange(u.user.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled
                  value={u.user_role.name}
                />
              </td>
              {/* 
                Uncomment for Google Auth
                <td>
                  <input
                    type="text"
                    disabled
                    placeholder="=> Link in App"
                  />
                </td> */}
              <td>
                <input
                  type="datetime"
                  disabled
                  value={user?.split(".")[0]}
                />
              </td>
              <td style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              >
                <ExtraFields table="users" id={u.user.id} />
                <button
                  style={{ marginRight: "5px" }}
                  onClick={() => confirmDeleteUser(u.user.id)}
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
                  onClick={(e) => showEditOptionUser(e, index)}
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
                  style={{
                    marginRight: "5px",
                    display: "none",
                  }}
                  className="editing"
                  onClick={(e) => editUser(e, u)}
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
                  onClick={(e) => closeEditUser(e, index)}
                  className="editing"
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
        }
      </>
    )
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUserPage(1, {
      field: searchParams.selectedField,
      order: searchParams.order
    }, searchParams);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getUserFields(language),
      selectedField: getUserFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  return (
    <>
      <StandardModal
        text={`Notify users`}
        icon={"notifications"}
        show={notifyModal}
        form={
          <>
            <textarea
              placeholder={"Text message."}
              onChange={(e) => {
                setNotifyMsg(e.target.value);
              }}
            />
          </>
        }
        hasIconAnimation
        hasTransition
        isQuestion
        onNoAction={() => {
          setNotifyModal(false);
          setNotifyMsg("");
        }}
        onYesAction={async () => {
          await notifyUsers();
          setNotifyModal(false);
          setNotifyMsg("");
        }}
      />
      <div className="add-form">
        <table id="users_table_header">
          <thead>
            <tr>
              <th></th>
              <th>{language.email}</th>
              <th>{language.password}</th>
              <th>{language.userRole}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{language.add}:</th>
              <td>
                <input id="u_email" type="email" placeholder={language.email} />
              </td>
              <td>
                <input
                  id="u_pass"
                  type="password"
                  placeholder={language.password}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <select id="u_role">
                  {userPermRoles.map((r) => {
                    return (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    );
                  })}
                </select>
              </td>
              <td className="action-column">
                <button
                  onClick={() => {
                    createUser();
                  }}
                >
                  <svg
                    id="add-svg"
                    xmlns="http://www.w3.org/2000/ svg"
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
      </div>
      <div className="notify-users">
        <PageSelect
          onPageChange={(p) => fetchUserPage(p, {
            field: searchParams.selectedField,
            order: searchParams.order,
          }, searchParams)}
          actualPage={actualPage}
          maxPages={maxPages}
        />
        <button onClick={() => setNotifyModal(true)}>
          {language.notifySelectedUsers}
        </button>
      </div>
      <div className="list-main-container">
        {users && users.length !== 0 ? (
          <div className="table-info">
            <table style={{ marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>
                    <input type={"checkbox"} onChange={() => selectAll()} />
                  </th>
                  <th>{language.userId}</th>
                  <th>{language.name}</th>
                  <th>{language.email}</th>
                  <th>{language.userRole}</th>
                  {/* Uncomment for Google Auth
                  <th>{language.googleLinked}</th> */}
                  <th>{language.lastConnection}</th>
                  <th>{language.actions}</th>
                </tr>
              </thead>
              <tbody>
                {memoizedUsers()}
              </tbody >
            </table >
          </div >
        ) : null
        }
      </div>
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setPopup(false);
          deleteUser(idDelete);
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
