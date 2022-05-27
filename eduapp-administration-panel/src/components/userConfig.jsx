import React, { useEffect, useState } from "react";
import * as USERSERVICE from "../services/user.service";
import * as ENROLLSERVICE from "../services/enrollConfig.service";
import * as API from "../API";
import StandardModal from "./modals/standard-modal/StandardModal";
export default function UserConfig(props) {
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [changeName, setChangeName] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeIsAdmin, setChangeIsAdmin] = useState(false);

  const [newName] = useState();
  const [newEmail] = useState();
  const [newIsAdmin] = useState();

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

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

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USERSERVICE.fetchUserInfos().then((us) => {
        setUsers(us.data);
      });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The users could not be showed, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(false);
      }
    });
  };

  const confirmDeleteUser = async (id) => {
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText("Are you sure you want to delete this user?");
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(id);
  };

  const showDeleteError = () => {
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText("The user could not be deleted.");
    setIsConfirmDelete(false);
  };

  const alertCreate = async () => {
    setPopupText("Required information is missing.");
    setPopupType("error");
    setPopup(true);
  };

  const editUser = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let email =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let isAdmin =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];

      let inputName = document.getElementById("inputName_" + s.id).value;
      let inputEmail = document.getElementById("inputEmail_" + s.id).value;
      let inputIsAdmin = document.getElementById("inputIsAdmin_" + s.id).value;

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

      if (inputIsAdmin !== "" && inputIsAdmin !== s.session_end_date) {
        editisAdmin = inputIsAdmin;
      } else {
        editisAdmin = s.session_end_date;
      }

      API.asynchronizeRequest(function () {
        USERSERVICE.editUser({
          id: s.id,
          user_name: editTitle,
          isAdmin: editisAdmin,
          isLoggedWithGoogle: s.isLoggedWithGoogle,
          googleid: s.googleid,
          user: {
            id: s.user_id,
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
            setPopupText("The user was edited successfully.");
            switchSaveState(false);
          })
          .catch((e) => {
            if (e) {
              setPopupText(
                "The user could not be edited, check if you entered the correct fields."
              );
              setPopupIcon("error");
              switchSaveState(false);
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The user could not be edited, check if you have an internet connection."
          );
          setPopupIcon("error");
          switchSaveState(false);
          setIsConfirmDelete(false);
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
        let inputIsAdmin = document.getElementById(
          "inputIsAdmin_" + s.id
        ).value;

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

        if (inputIsAdmin !== "" && inputIsAdmin !== s.session_end_date) {
          editisAdmin = inputIsAdmin;
        } else {
          editisAdmin = s.session_end_date;
        }

        API.asynchronizeRequest(function () {
          USERSERVICE.editUser({
            id: s.id,
            user_name: editTitle,
            isAdmin: editisAdmin,
            isLoggedWithGoogle: s.isLoggedWithGoogle,
            googleid: s.googleid,
            user: {
              id: s.user_id,
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
              setPopupText("The user was edited successfully.");
              switchSaveState(false);
              setIsConfirmDelete(false);
            })
            .catch((e) => {
              if (e) {
                setPopupText(
                  "The user could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
                setIsConfirmDelete(false);
              }
            });
        }).then((e) => {
          if (e) {
            setPopup(true);
            setPopupText(
              "The user could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
            switchSaveState(false);
            setIsConfirmDelete(false);
          }
        });
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let email = e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let isAdmin =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.user_id).value;
        let inputEmail = document.getElementById(
          "inputEmail_" + s.user_id
        ).value;
        let inputIsAdmin = document.getElementById(
          "inputIsAdmin_" + s.user_id
        ).checked;
        console.log(inputName, inputEmail, inputIsAdmin);

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

        if (inputIsAdmin !== "" && inputIsAdmin !== s.session_end_date) {
          editisAdmin = inputIsAdmin;
        } else {
          editisAdmin = s.session_end_date;
        }

        API.asynchronizeRequest(function () {
          USERSERVICE.editUser({
            id: s.id,
            user_id: s.user_id,
            user_name: editTitle,
            isAdmin: editisAdmin,
            profile_image: s.profile_image,
            teaching_list: s.teaching_list,
            isLoggedWithGoogle: s.isLoggedWithGoogle,
            googleid: s.googleid,
          })
            .then(() => {
              fetchUsers();
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
              setPopupText("The user was edited successfully.");
              switchSaveState(false);
              setIsConfirmDelete(false);
            })
            .catch((e) => {
              console.log(e);
              if (e) {
                setPopupText(
                  "The user could not be edited, check if you entered the correct fields."
                );
                setPopupIcon("error");
                switchSaveState(false);
                setIsConfirmDelete(false);
                setPopup(true);
              }
            });
        }).then((e) => {
          if (e) {
            setPopup(true);
            setIsConfirmDelete(false);

            setPopupText(
              "The user could not be edited, check if you have an internet connection."
            );
            setPopupIcon("error");
            switchSaveState(false);
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

  const createUser = () => {
    let isAdmin = document.getElementById("u_admin").checked;
    let email = document.getElementById("u_email").value;
    let pass = document.getElementById("u_pass").value;

    if (email && pass) {
      const payload = new FormData();
      payload.append("user[email]", email);
      payload.append("user[password]", pass);

      API.asynchronizeRequest(function () {
        USERSERVICE.createUser(payload).then((res) => {
          const payload = new FormData();
          payload.delete("user[email]");
          payload.delete("user[password]");
          payload.append("user_id", res.data.message.id);
          payload.append("user_name", res.data.message.email.split("@")[0]);
          payload.append("isAdmin", isAdmin);

          USERSERVICE.createInfo(payload).then(() => {
            userEnroll(res.data.message.id);
            fetchUsers();
            document.getElementById("u_admin").checked = false;
            document.getElementById("u_email").value = null;
            document.getElementById("u_pass").value = null;
            setPopup(true);
            setPopupType("info");
            setPopupText("The new user was created successfully.");
            switchSaveState(true);
          });
        });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The new user could not be published, check if you have an internet connection."
          );
          setPopupIcon("error");
          switchSaveState(false);
        }
      });
    } else {
      alertCreate();
    }
  };

  const userEnroll = (uId) => {
    const payload = new FormData();
    payload.append("course_id", 1);
    payload.append("user_id", uId);

    API.asynchronizeRequest(function () {
      ENROLLSERVICE.createTuition(payload).then(() => {
        console.log("User tuition has been completed successfully!");
      });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The new user could not be published, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(false);
      }
    });
  };

  const deleteUser = (id) => {
    API.asynchronizeRequest(function () {
      USERSERVICE.deleteUser(id)
        .then(() => {
          fetchUsers();
        })
        .catch(() => {
          showDeleteError();
        });
    }).then((e) => {
      if (e) {
        setPopup(true);
        setPopupText(
          "The user could not be deleted, check if you have an internet connection."
        );
        setPopupIcon("error");
        switchSaveState(true);
      }
    });
  };

  const handleChangeName = (id) => {
    setChangeName(true);
    return document.getElementById(`inputName_${id}`).value;
  };

  const handleChangeEmail = (id) => {
    setChangeEmail(true);
    return document.getElementById(`inputEmail_${id}`).value;
  };

  const handleChangeIsAdmin = (id) => {
    setChangeIsAdmin(true);
    return document.getElementById(`inputIsAdmin_${id}`).value;
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
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{props.language.email}</th>
              <th>{props.language.password}</th>
              <th>{props.language.isAdmin}</th>
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
                <input
                  id="u_admin"
                  type="checkbox"
                  placeholder={props.language.name}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <table style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              
              <th>{props.language.name}</th>
              <th>{props.language.email}</th>
              <th>{props.language.isAdmin}</th>
              <th>{props.language.googleLinked}</th>
              <th>{props.language.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users
              ? users.map((u) => {
                  if (search.length > 0) {
                    if (
                      (u.user_name.includes(search) ||
                        u.user.email.includes(search)) &
                      filterUsersWithRole(userRole, u)
                    ) {
                      return (
                        <tr key={u.id}>
                          <td>{u.user.id}</td>

                          <td>
                            <input
                              id={`inputName_${u.user_id}`}
                              type="text"
                              disabled
                              value={
                                changeName === false ? u.user_name : newName
                              }
                              onChange={() => {
                                handleChangeName(u.user_id);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              id={`inputEmail_${u.user_id}`}
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
                          <td style={{ textAlign: "center" }}>
                            {changeIsAdmin === false ? (
                              u.isAdmin ? (
                                <input
                                  id={`inputIsAdmin_${u.user.id}`}
                                  type="checkbox"
                                  disabled
                                  checked
                                  onChange={() => {
                                    handleChangeIsAdmin(u.user.id);
                                  }}
                                />
                              ) : (
                                <input
                                  id={`inputIsAdmin_${u.user.id}`}
                                  type="checkbox"
                                  disabled
                                  onChange={() => {
                                    handleChangeIsAdmin(u.user.id);
                                  }}
                                />
                              )
                            ) : newIsAdmin ? (
                              <input
                                id={`inputIsAdmin_${u.user.id}`}
                                type="checkbox"
                                disabled
                                checked
                              />
                            ) : (
                              <input
                                id={`inputIsAdmin_${u.user.id}`}
                                type="checkbox"
                                disabled
                              />
                            )}
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
                  } else if (filterUsersWithRole(userRole, u)) {
                    return (
                      <tr key={u.id}>
                        <td>{u.user.id}</td>

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
                        <td style={{ textAlign: "center" }}>
                          {changeIsAdmin === false ? (
                            u.isAdmin ? (
                              <input
                                id={`inputIsAdmin_${u.user.id}`}
                                type="checkbox"
                                disabled
                                checked
                                onChange={() => {
                                  handleChangeIsAdmin(u.user.id);
                                }}
                              />
                            ) : (
                              <input
                                id={`inputIsAdmin_${u.user.id}`}
                                type="checkbox"
                                disabled
                                onChange={() => {
                                  handleChangeIsAdmin(u.user.id);
                                }}
                              />
                            )
                          ) : newIsAdmin ? (
                            <input
                              id={`inputIsAdmin_${u.user.id}`}
                              type="checkbox"
                              disabled
                              checked
                            />
                          ) : (
                            <input
                              id={`inputIsAdmin_${u.user.id}`}
                              type="checkbox"
                              disabled
                            />
                          )}
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
                            <input type="text" disabled value={u.user_id} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user_name} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user.email} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {u.isAdmin ? (
                              <input type="checkbox" disabled checked />
                            ) : (
                              <input type="checkbox" disabled />
                            )}
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
                          <input type="text" disabled value={u.user_id} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user_name} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user.email} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {u.isAdmin ? (
                            <input type="checkbox" disabled checked />
                          ) : (
                            <input type="checkbox" disabled />
                          )}
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

                  if (search.length > 0) {
                    if (
                      (u.user_name.includes(search) ||
                        u.user.email.includes(search)) &
                      filterUsersWithRole(userRole, u)
                    ) {
                      return (
                        <tr key={u.id}>
                          <td>
                            <input type="text" disabled value={u.user_id} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user_name} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user.email} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {u.isAdmin ? (
                              <input type="checkbox" disabled checked />
                            ) : (
                              <input type="checkbox" disabled />
                            )}
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
                          <input type="text" disabled value={u.user_id} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user_name} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user.email} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {u.isAdmin ? (
                            <input type="checkbox" disabled checked />
                          ) : (
                            <input type="checkbox" disabled />
                          )}
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
                })
              : null}
          </tbody>
        </table>
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
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        onNoAction={() => {
          setPopup(false);
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
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
