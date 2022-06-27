import React, { useEffect, useState } from "react";
import * as USERSERVICE from "../services/user.service";
import * as ENROLLSERVICE from "../services/enrollConfig.service";
import * as API from "../API";
import StandardModal from "./modals/standard-modal/StandardModal";
import ExtraFields from "./ExtraFields";
import * as COURSESERVICE from "../services/course.service";
import * as CHATSERVICE from "../services/chat.service";
import * as ROLESERVICE from "../services/role.service";
import asynchronizeRequest from "../API";
import { getOfflineUser, interceptExpiredToken } from "../utils/OfflineManager";
import EncryptionUtils from "../utils/EncryptionUtils";
import PageSelect from "./pagination/PageSelect";

const system_user_name = "eduapp_system";
export default function UserConfig(props) {


  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [changeName, setChangeName] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);

  const [newName] = useState();
  const [newEmail] = useState();

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const [userPermRoles, setUserPermRoles] = useState([]);
  const [allSelected, setAllSelected] = useState(true);
  const [maxPages, setMaxPages] = useState(1);

  const [notifyModal, setNotifyModal] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");

  const shortUUID = (uuid) => uuid.substring(0, 8);

  const selectAll = () => {
    setAllSelected(!allSelected);
    for (let c of document.getElementsByName("user-check")) {
      c.checked = allSelected;
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

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(props.language.connectionAlert);
    setPopupIcon("error");
  };

  const fetchUsers = () => {
    asynchronizeRequest(function () {
      USERSERVICE.pagedUserInfos(1)
        .then((us) => {
          setMaxPages(us.data.total_pages);
          setUsers(us.data.current_page);
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

  const fetchUserPage = (page) => {
    asynchronizeRequest(function () {
      USERSERVICE.pagedUserInfos(page)
        .then((us) => {
          setMaxPages(us.data.total_pages);
          setUsers(us.data.current_page);
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

  const fetchRoles = () => {
    asynchronizeRequest(function () {
      ROLESERVICE.fetchRoles()
        .then((roles) => {
          setUserPermRoles(roles);
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

  const confirmDeleteUser = async (id) => {
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

  const alertCreate = async () => {
    switchEditState(false);
    setPopupText(props.language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const editUser = (e, s) => {
    switchEditState(false);
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let email =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let isAdmin =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];

      let inputName = document.getElementById("inputName_" + s.user.id).value;
      let inputEmail = document.getElementById("inputEmail_" + s.user.id).value;

      let editTitle, editEmail;

      if (inputName !== "" && inputName !== s.session_name) {
        editTitle = inputName;
      } else {
        editTitle = s.session_name;
      }

      if (inputEmail !== "" && inputEmail !== s.email) {
        editEmail = inputEmail;
      } else {
        editEmail = s.session_start_date;
      }

      API.asynchronizeRequest(function () {
        USERSERVICE.editUser({
          id: s.id,
          user_name: editTitle,
          isLoggedWithGoogle: s.isLoggedWithGoogle,
          googleid: s.googleid,
          user: {
            id: s.user.id,
            email: editEmail,
          },
        })
          .then(() => {
            fetchUsers();
            let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
            buttonDelete.style.display = "block";
            let button = e.target.parentNode.parentNode.childNodes[1];
            button.style.display = "block";
            let checkButton = e.target.parentNode.parentNode.childNodes[2];
            checkButton.style.display = "none";
            let cancelButton = e.target.parentNode.parentNode.childNodes[3];
            cancelButton.style.display = "none";
            name.disabled = true;
            email.disabled = true;
            isAdmin.disabled = true;
            setIsConfirmDelete(false);
            setPopup(true);
            setPopupType("info");
            setPopupText(props.language.editAlertCompleted);
            switchSaveState(false);
          })
          .catch((e) => {
            if (e) {
              setPopupText(props.language.editAlertFailed);
              setPopupIcon("error");
              switchSaveState(false);
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).then((e) => {
        if (e) {
          connectionAlert();
        }
      });
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let email =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let isAdmin =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputEmail = document.getElementById("inputEmail_" + s.id).value;

        let editTitle, editEmail, editisAdmin;

        if (inputName !== "" && inputName !== s.session_name) {
          editTitle = inputName;
        } else {
          editTitle = s.session_name;
        }

        if (inputEmail !== "" && inputEmail !== s.email) {
          editEmail = inputEmail;
        } else {
          editEmail = s.session_start_date;
        }

        API.asynchronizeRequest(function () {
          USERSERVICE.editUser({
            id: s.id,
            user_name: editTitle,
            isLoggedWithGoogle: s.isLoggedWithGoogle,
            googleid: s.googleid,
            user: {
              id: s.user.id,
              email: editEmail,
            },
          })
            .then(() => {
              fetchUsers();
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
              email.disabled = true;
              isAdmin.disabled = true;

              setPopup(true);
              setPopupType("info");
              setPopupText(props.language.editAlertCompleted);
              switchSaveState(false);
              setIsConfirmDelete(false);
            })
            .catch((e) => {
              if (e) {
                setPopupText(props.language.editAlertFailed);
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
                setIsConfirmDelete(false);
              }
            });
        }).then((e) => {
          if (e) {
            connectionAlert();
          }
        });
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let email = e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let isAdmin =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.user.id).value;
        let inputEmail = document.getElementById(
          "inputEmail_" + s.user.id
        ).value;

        let editTitle, editEmail;

        if (inputName !== "" && inputName !== s.session_name) {
          editTitle = inputName;
        } else {
          editTitle = s.session_name;
        }

        if (inputEmail !== "" && inputEmail !== s.email) {
          editEmail = inputEmail;
        } else {
          editEmail = s.session_start_date;
        }

        API.asynchronizeRequest(function () {
          USERSERVICE.editUser({
            id: s.id,
            user_id: s.user.id,
            user_name: editTitle,
            profile_image: s.profile_image,
            teaching_list: s.teaching_list,
            isLoggedWithGoogle: s.isLoggedWithGoogle,
            googleid: s.googleid,
          })
            .then(() => {
              fetchUsers();
              switchEditState(false);
              let buttonDelete = e.target.parentNode.childNodes[0];
              buttonDelete.style.display = "block";
              let button = e.target.parentNode.childNodes[1];
              button.style.display = "block";
              let checkButton = e.target.parentNode.childNodes[2];
              checkButton.style.display = "none";
              let cancelButton = e.target.parentNode.childNodes[3];
              cancelButton.style.display = "none";
              name.disabled = true;
              email.disabled = true;
              isAdmin.disabled = true;

              setPopup(true);
              setPopupType("info");
              setPopupText(props.language.editAlertCompleted);
              switchSaveState(false);
              setIsConfirmDelete(false);
            })
            .catch((e) => {
              if (e) {
                setPopupText(props.language.editAlertFailed);
                setPopupIcon("error");
                switchSaveState(false);
                setIsConfirmDelete(false);
                setPopup(true);
              }
            });
        }).then((e) => {
          if (e) {
            connectionAlert();
          }
        });
      }
    }
  };

  const closeEditUser = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let emails =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let isAdmin =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];

      name.disabled = true;
      emails.disabled = true;
      isAdmin.disabled = true;

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
        let email =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let isAdmin =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[3].childNodes[0];

        name.disabled = true;
        email.disabled = true;
        isAdmin.disabled = true;

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
        let email = e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let isAdmin =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        name.disabled = true;
        email.disabled = true;
        isAdmin.disabled = true;

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

  const showEditOptionUser = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let email =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let isAdmin =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];

      name.disabled = false;
      email.disabled = false;
      isAdmin.disabled = false;
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
        let email =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let isAdmin =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];

        name.disabled = false;
        email.disabled = false;
        isAdmin.disabled = false;

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
        let email = e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let isAdmin =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        name.disabled = false;
        email.disabled = false;
        isAdmin.disabled = false;

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

  const createUser = (e) => {
    e.preventDefault();
    switchEditState(false);

    let email = document.getElementById("u_email").value;
    let pass = document.getElementById("u_pass").value;
    let role = document.getElementById("u_role").value;

    if (email && pass) {
      asynchronizeRequest(async function () {
        USERSERVICE.createUser({
          requester_id: getOfflineUser().user.id,
          email: email,
          password: pass,
          user_role: role,
        })
          .then(async (res) => {
            await userEnroll(res.data.user.id);
            fetchUsers();
            document.getElementById("u_email").value = null;
            document.getElementById("u_pass").value = null;
            setPopup(true);
            setPopupType("info");
            setPopupText(props.language.creationCompleted);
            switchSaveState(true);
          })
          .catch(async (error) => {
            await interceptExpiredToken(error);
            alertCreate();
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

  const userEnroll = async (uId) => {
    switchEditState(false);
    const payload = new FormData();
    payload.append(
      "course_id",
      (await COURSESERVICE.fetchGeneralCourse()).data.id
    );
    payload.append("user_id", uId);

    API.asynchronizeRequest(function () {
      ENROLLSERVICE.createTuition(payload).then(() => {
        console.log("User tuition has been completed successfully!");
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const deleteUser = async (id) => {
    switchEditState(false);
    let systemUser = (await USERSERVICE.fetchSystemUser()).data;
    if (id !== systemUser.user.id) {
      if (id !== getOfflineUser().user.id) {
        asynchronizeRequest(function () {
          USERSERVICE.deleteUser(id)
            .then((err) => {
              if (err) {
                setPopup(true);
                setPopupType("info");
                setPopupText(props.language.deleteAlertCompleted);
                setIsConfirmDelete(false);
                switchSaveState(false);
                fetchUsers();
              }
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
      } else {
        alert("Dumbass");
      }
    } else {
      alert("Cannot delete system user.");
    }
  };

  const handleChangeName = (id) => {
    setChangeName(true);
    return document.getElementById(`inputName_${id}`).value;
  };

  const handleChangeEmail = (id) => {
    setChangeEmail(true);
    return document.getElementById(`inputEmail_${id}`).value;
  };

  const notifyUsers = async () => {
    let systemUser = (await USERSERVICE.fetchSystemUser()).data;
    for (let u of document.getElementsByName("user-check")) {
      if (u.checked) {
        let uid = u.id.split("_")[1];
        let chat_info;
        try {
          chat_info = await CHATSERVICE.fetchUserNotifsChat(uid);
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
  };

  const filterUsersWithRole = (role, user) => {
    switch (role) {
      case null:
        if (user.isAdmin || !user.isAdmin) {
          return true;
        }
        break;
      case 0:
        if (user.isAdmin) {
          return false;
        } else {
          return true;
        }

      case 1:
        if (!user.isAdmin) {
          return false;
        } else {
          return true;
        }
      default:
        break;
    }
  };

  useEffect(() => {
    setSearch(props.search);
  }, [props.search]);

  useEffect(() => {
    setUserRole(props.userRole);
  }, [props.userRole]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <StandardModal
      text={`Notify users`}
      icon={"notifications"}
      show={notifyModal}
      form={
        <>
          <textarea placeholder={'Text message.'} onChange={(e)=>{
            setNotifyMsg(e.target.value)
          }}/>
          </>}
      hasIconAnimation
      hasTransition
      isQuestion
      onNoAction={()=>{
        setNotifyModal(false)
        setNotifyMsg("")
      }}
      onYesAction={
        async ()=>{
          await notifyUsers();
          setNotifyModal(false)
          setNotifyMsg("")
        }
      }/>
      <div className="schedulesesionslist-main-container">
        <table id='users_table_header'>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table>
          <thead>
            <tr>
              <th>{props.language.add}</th>
              <th>{props.language.email}</th>
              <th>{props.language.password}</th>
              <th>{props.language.userRole}</th>

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
                <button onClick={createUser}>
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
              <td>
                <input
                  id="u_email"
                  type="email"
                  placeholder={props.language.email}
                />
              </td>
              <td>
                <input
                  id="u_pass"
                  type="password"
                  placeholder={props.language.password}
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
            </tr>
          </tbody>
        </table>
        <div className="notify-users">
          <PageSelect
            onPageChange={async (p) => fetchUserPage(p)}
            maxPages={maxPages}
          />
          <button onClick={() => setNotifyModal(true)}>Notify Selected Users</button>
        </div>
        <table style={{ marginTop: "25px" }}>
          <thead>
            <tr>
              <th>
                <input type={"checkbox"} onChange={() => selectAll()} />
              </th>
              <th>{props.language.userId}</th>
              <th>{props.language.name}</th>
              <th>{props.language.email}</th>
              <th>{props.language.userRole}</th>
              <th>{props.language.googleLinked}</th>
              <th></th>
              <th>{props.language.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users
              ? // eslint-disable-next-line array-callback-return
                users.map((u) => {
                  if (search.length > 0) {
                    if (
                      (u.user_name.includes(search) ||
                        u.user.email.includes(search)) &
                      filterUsersWithRole(userRole, u)
                    ) {
        {users && users.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchUserPage(p)}
                maxPages={maxPages}
              />
              <button onClick={() => notifyUsers()}>
                Notify Selected Users
              </button>
            </div>
            <div className="schedule-table-info">
              <table style={{ marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th>
                      <input type={"checkbox"} onChange={() => selectAll()} />
                    </th>
                    <th>{props.language.userId}</th>
                    <th>{props.language.name}</th>
                    <th>{props.language.email}</th>
                    <th>{props.language.userRole}</th>
                    <th>{props.language.googleLinked}</th>
                    <th>{props.language.lastConnection}</th>
                    <th>{props.language.actions}</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => {
                    let user = u.user.last_sign_in_at;
                    if (search.length > 0) {
                      if (
                        (u.user_name.includes(search) ||
                          u.user.email.includes(search)) &
                        filterUsersWithRole(userRole, u)
                      ) {
                        return (
                          <tr key={u.id}>
                            <td>
                              <input
                                id={`check_${u.user.id}`}
                                type={"checkbox"}
                                disabled={u.user_name === system_user_name}
                                name={
                                  u.user_name === system_user_name
                                    ? null
                                    : "user-check"
                                }
                              />
                            </td>
                            <td>{shortUUID(u.user.id)}</td>
                            <td>
                              <input
                                id={`inputName_${u.user.id}`}
                                type="text"
                                disabled
                                value={
                                  changeName === false ? u.user_name : newName
                                }
                                onChange={() => {
                                  handleChangeName(u.user.id);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                id={`inputEmail_${u.user.id}`}
                                type="text"
                                disabled
                                value={
                                  changeEmail === false
                                    ? u.user.email
                                    : newEmail
                                }
                                onChange={() => {
                                  handleChangeEmail(u.user.id);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                value={u.user_role.name}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                placeholder="=> Link in App"
                              />
                            </td>
                            <td>
                              <input
                                type="datetime"
                                disabled
                                value={user.split(".")[0]}
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
                                style={{ marginRight: "5px" }}
                                onClick={() => {
                                  confirmDeleteUser(u.user.id);
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
                                  showEditOptionUser(e, u);
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
                                style={{
                                  marginRight: "5px",
                                  display: "none",
                                }}
                                onClick={(e) => {
                                  editUser(e, u);
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
                                  closeEditUser(e, u);
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
                    } else if (filterUsersWithRole(userRole, u)) {
                      return (
                        <tr key={u.id}>
                          <td>
                            <input
                              id={`check_${u.user.id}`}
                              type={"checkbox"}
                              disabled={u.user_name === system_user_name}
                              name={
                                u.user_name === system_user_name
                                  ? null
                                  : "user-check"
                              }
                            />
                          </td>
                          <td>{shortUUID(u.user.id)}</td>
                          <td>
                            <input
                              id={`inputName_${u.user.id}`}
                              type="text"
                              disabled
                              value={
                                changeName === false ? u.user_name : newName
                              }
                              onChange={() => {
                                handleChangeName(u.user.id);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              id={`inputEmail_${u.user.id}`}
                              type="text"
                              disabled
                              value={
                                changeEmail === false ? u.user.email : newEmail
                              }
                              onChange={() => {
                                handleChangeEmail(u.user.id);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              value={u.user_role.name}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              placeholder="=> Link in App"
                            />
                          </td>
                          <td>
                          <ExtraFields id = {u.user.id} table = {'users'}/>
                            <input
                              type="datetime-local"
                              disabled
                              value={user.split(".")[0]}
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
                              style={{ marginRight: "5px" }}
                              onClick={() => {
                                confirmDeleteUser(u.user.id);
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
                                showEditOptionUser(e, u);
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
                              style={{
                                marginRight: "5px",
                                display: "none",
                              }}
                              onClick={(e) => {
                                editUser(e, u);
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
                                closeEditUser(e, u);
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
                  } else if (filterUsersWithRole(userRole, u)) {
                    return (
                      <tr key={u.id}>
                        <td>
                          <input
                            id={`check_${u.user.id}`}
                            type={"checkbox"}
                            disabled={u.user_name === system_user_name}
                            name={
                              u.user_name === system_user_name
                                ? null
                                : "user-check"
                            }
                          />
                        </td>
                        <td>{shortUUID(u.user.id)}</td>
                        <td>
                          <input
                            id={`inputName_${u.user.id}`}
                            type="text"
                            disabled
                            value={changeName === false ? u.user_name : newName}
                            onChange={() => {
                              handleChangeName(u.user.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputEmail_${u.user.id}`}
                            type="text"
                            disabled
                            value={
                              changeEmail === false ? u.user.email : newEmail
                            }
                            onChange={() => {
                              handleChangeEmail(u.user.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            value={u.user_role.name}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            placeholder="=> Link in App"
                          />
                        </td>
                        <td>
                        <ExtraFields id = {u.user.id} table = {'users'}/>
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
                              confirmDeleteUser(u.user.id);
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
                              showEditOptionUser(e, u);
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
                              editUser(e, u);
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
                              closeEditUser(e, u);
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

                    if (search.length > 0) {
                      if (
                        (u.user_name.includes(search) ||
                          u.user.email.includes(search)) &
                        filterUsersWithRole(userRole, u)
                      ) {
                        return (
                          <tr key={u.id}>
                            <td>
                              <input
                                id={`check_${u.user.id}`}
                                type={"checkbox"}
                                disabled={u.user_name === system_user_name}
                                name={
                                  u.user_name === system_user_name
                                    ? null
                                    : "user-check"
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                value={shortUUID(u.user.id)}
                              />
                            </td>
                            <td>
                              <input type="text" disabled value={u.user_name} />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                value={u.user.email}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                value={u.user_role.name}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                placeholder="=> Link in App"
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
                                  deleteUser(u.user.id);
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
                            </td>
                          </tr>
                        );
                      }
                    } else if (filterUsersWithRole(userRole, u)) {
                      return (
                        <tr key={u.id}>
                          <td>
                            <input
                              id={`check_${u.user.id}`}
                              type={"checkbox"}
                              disabled={u.user_name === system_user_name}
                              name={
                                u.user_name === system_user_name
                                  ? null
                                  : "user-check"
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              value={shortUUID(u.user.id)}
                            />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user_name} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user.email} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              disabled
                              checked={u.isAdmin}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              placeholder="=> Link in App"
                            />
                          </td>
                          <td>
                          <ExtraFields id = {u.user.id} table = {'users'}/>
                          
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
                                deleteUser(u.user.id);
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
                          </td>
                        </tr>
                      );
                    }
<<<<<<< HEAD
                  } else if (filterUsersWithRole(userRole, u)) {
                    return (
                      <tr key={u.id}>
                        <td>
                          <input
                            id={`check_${u.user.id}`}
                            type={"checkbox"}
                            disabled={u.user_name === system_user_name}
                            name={
                              u.user_name === system_user_name
                                ? null
                                : "user-check"
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            value={shortUUID(u.user.id)}
                          />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user_name} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user.email} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="checkbox" disabled checked={u.isAdmin} />
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            placeholder="=> Link in App"
                          />
                        </td>
                        <td>
                        <ExtraFields id = {u.user.id} table = {'users'}/>
                         
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
                              deleteUser(u.user.id);
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
                        </td>
                      </tr>
                    );
                  }
=======
>>>>>>> develop

                    if (search.length > 0) {
                      if (
                        (u.user_name.includes(search) ||
                          u.user.email.includes(search)) &
                        filterUsersWithRole(userRole, u)
                      ) {
                        return (
                          <tr key={u.id}>
                            <td>
                              <input
                                type="checkbox"
                                name="select_user"
                                disabled
                                id={`select_user_${u.user.id}`}
                              />
                            </td>
                            <td>
                              <input type="text" disabled value={u.user_name} />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                value={u.user.email}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                disabled
                                checked={u.isAdmin}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled
                                placeholder="=> Link in App"
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
                                  deleteUser(u.user.id);
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
                            </td>
                          </tr>
                        );
                      }
                    } else if (filterUsersWithRole(userRole, u)) {
                      return (
                        <tr key={u.id}>
                          <td>
                            <input
                              type="checkbox"
                              name="select_user"
                              disabled
                              id={`select_user_${u.user.id}`}
                            />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user_name} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user.email} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              disabled
                              checked={u.isAdmin}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              placeholder="=> Link in App"
                            />
                          </td>
                          <td>
                          <ExtraFields id = {u.user.id} table = {'users'}/>
                          
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
                                deleteUser(u.user.id);
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
                          </td>
                        </tr>
                      );
                    } else {
                      return null;
                    }
<<<<<<< HEAD
                  } else if (filterUsersWithRole(userRole, u)) {
                    return (
                      <tr key={u.id}>
                        <td>
                          <input
                            type="checkbox"
                            name="select_user"
                            disabled
                            id={`select_user_${u.user.id}`}
                          />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user_name} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user.email} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="checkbox" disabled checked={u.isAdmin} />
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            placeholder="=> Link in App"
                          />
                        </td>
                        <td>
                        <ExtraFields id = {u.user.id} table = {'users'}/>
                         
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
                              deleteUser(u.user.id);
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
                        </td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })
              : null}
          </tbody>
        </table>
=======
                    return true;
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
>>>>>>> develop
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
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          switchSaveState();
          setIsConfirmDelete(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
