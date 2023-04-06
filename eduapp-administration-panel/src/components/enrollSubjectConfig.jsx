/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState, useRef } from "react";
import * as API from "../API";
// import * as SUBJECTSUSERSSERVICE from "../services/enrollSubjectConfig.service";
import * as USERSSERVICE from "../services/user.service";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as CHATSERVICE from "../services/chat.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import PageSelect from "./pagination/PageSelect";
import useFilter from "../hooks/useFilter";
import { getSubjectEnrollmentFields } from "../constants/search_fields";
import Typeahead from "./Typeahead";
import { LoaderCtx } from "../hooks/LoaderContext";

export default function EnrollSubjectConfig() {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [language] = useContext(LanguageCtx);

  const [subjectsUsers, setSubjectsUsers] = useState(null);
  const [users, setUsers] = useState(null);
  const [subjects, setSubjects] = useState(null);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const [subjectEdit, setSubjectEdit] = useState([]);

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const subjectsUsersBeforeEditing = useRef(null);

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "101%";
      document.getElementById("standard-modal").style.height = "101%";
      document.getElementById("controlPanelContentContainer").style.overflow =
        "hidden";
    }
  };
  const finalizedEdit = (type, icon, text, confirmDel) => {
    fetchSubjectsUsers(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  };

  const finalizedCreate = (type, icon, txt, confirmDel) => {
    fetchSubjectsUsers(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(txt);
  };

  const finalizedDelete = (type, icon, confirmDel, text) => {
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchSubjectsUsers(actualPage);
  };

  const connectionAlert = async () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  };

  const fetchSubjectsUsers = (pages) => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.pagedSubjects(pages, searchParams)
        .then((ts) => {
          setSubjectsUsers(ts.data.current_page);
          setActualPage(ts.data.page);
          setMaxPages(ts.data.total_pages);
        })
        .catch(async (err) => {
          interceptExpiredToken(err);
        });
    }).then(async (e) => {
      if (e) {
        connectionAlert();
        await interceptExpiredToken(e);
      }
    });
  };

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USERSSERVICE.fetchUserInfos().then((us) => {
        setUsers(us.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchSubjects = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects().then((cs) => setSubjects(cs.data));
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchAll = () => {
    fetchSubjects();
    fetchUsers();
  };

  const alertCreate = async () => {
    setPopupText(language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const createSubjectUser = async (e) => {
    e.preventDefault();
    switchEditState(false);

    const user_value = document.getElementById("user_select").value;
    const user = users.find(user => user.user.id === user_value)
    const subject_value = document.getElementById("subject_select").value
    const subject = subjects.find(subject => subject.id === subject_value)
    let chatBase = subject.chat_link;
    let isChatAdmin;
    if (user.user_role.name !== ("eduapp_admin" || "eduapp_teacher")) {
      isChatAdmin = false;
    }

    let valid = true;
    if (user === "-" && subject === "-") valid = false;

    if (valid) {
      API.asynchronizeRequest(function () {
        const enrollPayload = new FormData();
        enrollPayload.append("subject_id", subject.id);
        enrollPayload.append("user_id", user.user.id);
        enrollPayload.append("enrollment", true);

        SUBJECTSERVICE.createSubject(enrollPayload)
          .then((e) => {
            if (e) {
              fetchAll();
              fetchSubjectsUsers(actualPage);
              setPopup(true);
              setPopupType("info");
              setPopupText(language.creationCompleted);
            }
          })
          .catch((e) => {
            if (e) {
              interceptExpiredToken(e);
              setPopup(true);
              setPopupType("info");
              setPopupText(language.creationAlert);
            }
          });

        if (chatBase) {
          CHATSERVICE.createParticipant({ chat_base_id: chatBase, user_id: user.user.id, isChatAdmin }).catch((e) => {
            if (e) {
              interceptExpiredToken(e);
              setPopup(true);
              setPopupType("info");
              setPopupText(language.creationAlert);
            }
          });
        }
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

  const confirmDeleteEvent = async (subjectId, userId) => {
    switchEditState(false);
    finalizedDelete("warning", true, true, language.deleteAlert);
    setIdDelete([subjectId, userId]);
  };

  const deleteSubjectUser = (id) => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.deleteSubjectEnrollment({
        id: id[0].id,
        user_id: id[1]
      })
        .then((e) => {
          if (e) {
            finalizedDelete("info", true, false, language.deleteAlertCompleted);
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedDelete("error", true, false, language.deleteAlertFailed);
            await interceptExpiredToken(e);
          }
        });
      if (id[0].chat_link) {
        CHATSERVICE.deleteParticipantUserId({ chat_base_id: id[0].chat_link, user_id: id[1] }).catch((e) => {
          if (e) {
            interceptExpiredToken(e);
            setPopup(true);
            setPopupType("info");
            setPopupText(language.creationAlert);
          }
        });
      }
    }).then(async (e) => {
      if (e) {
        connectionAlert();
        await interceptExpiredToken(e);
      }
    });
  };

  const editEnroll = (e, s) => {
    switchEditState(false);

    let inputUser = document.getElementById("inputUserID_" + s.id).value;
    let inputSubject = document.getElementById("inputSubjectID_" + s.id).value;

    let editUser,
      editSubject;

    if (inputUser !== "" && inputUser !== s.user.id) {
      editUser = inputUser;
    } else {
      editUser = s.user.id;
    }

    if (inputSubject !== "" && inputSubject !== s.subject.id) {
      editSubject = inputSubject;
    } else {
      editSubject = s.subject.id;
    }

    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.editSubject({
        id: s.id,
        subject_id: editSubject,
        user_id: editUser,
      })
        .then((error) => {
          if (error) {
            let num = 0;
            while (num < 4) {
              e.target.parentNode.childNodes[num].style.display === "block"
                ? (e.target.parentNode.childNodes[num].style.display = "none")
                : (e.target.parentNode.childNodes[num].style.display = "block");
              num += 1;
            }
            let disable = 0;
            while (disable < 2) {
              e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
              disable += 1;
            }
            finalizedEdit("info", true, language.editAlertCompleted, false);
          }
        })
        .catch(async (e) => {
          if (e) {
            finalizedEdit("error", true, language.editAlertFailed, false);
            await interceptExpiredToken(e);
          }
        });
    }).then(async (e) => {
      if (e) {
        alertCreate();
        await interceptExpiredToken(e);
      }
    });
  };

  const closeEditSubjectsUsers = (e, index) => {
    let disable = 0;
    while (disable < 2) {
      e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
      disable += 1;
    }

    let auxSubjectsUsers = [...subjectsUsers];
    auxSubjectsUsers[index] = { ...subjectsUsersBeforeEditing.current };
    setSubjectsUsers(auxSubjectsUsers);

    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const showEditSubjectsUsers = (e, index) => {
    let disable = 0;
    while (disable < 2) {
      e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = false;
      disable += 1;
    }
    subjectsUsersBeforeEditing.current = { ...subjectsUsers[index] };

    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === ""
        ? e.target.parentNode.childNodes[num].style.display === "none"
          ? (e.target.parentNode.childNodes[num].style.display = "block")
          : (e.target.parentNode.childNodes[num].style.display = "none")
        : e.target.parentNode.childNodes[num].style.display === "block"
          ? (e.target.parentNode.childNodes[num].style.display = "none")
          : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const handleChangeUser = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    users.map(u => {
      if (u.user.id == newValue) {
        const newSubjectsUsers = [...subjectsUsers];
        newSubjectsUsers[index][inputName] = u;
        setSubjectsUsers(newSubjectsUsers);
        return
      }
    })
  }

  const handleChangeSubject = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    subjects.map(c => {
      if (c.id == newValue) {
        const newSubjectsUsers = [...subjectsUsers];
        newSubjectsUsers[index][inputName] = c;
        setSubjectsUsers(newSubjectsUsers);
        return
      }
    })
  }

  const memoizedSubjectsUsers = () => {
    return (
      <>
        {
          subjectsUsers && subjectsUsers.filter(subject => subject.users).map((subject) => {
            return subject.users.map((user, index) => {
              // subjectsUsers && subjectsUsers.map((su, index) => { 
              return (
                <tr key={user.id}>
                  <td>
                    <select id={`inputUserID_${user.id}`} disabled
                      name="user"
                      onChange={(event) => handleChangeUser(index, event)}>
                      {users
                        && users.map((thisUser) => {
                          if (user.id == thisUser.user.id) {
                            return (
                              <option key={thisUser.user.id} value={thisUser.user.id} selected>
                                {thisUser.user.email}
                              </option>
                            )
                          }
                          return (<option key={thisUser.user.id} value={thisUser.user.id}>
                            {thisUser.user.email}
                          </option>
                          )
                        })
                      }
                    </select>
                  </td>
                  <td>
                    <select id={`inputSubjectID_${subject.id}`} disabled
                      name="subject"
                      onChange={(event) => handleChangeSubject(index, event)}>
                      {subjects
                        && subjects.map((thisSubject) => {
                          if (subject.id == thisSubject.id) {
                            return (
                              <option key={thisSubject.id} value={thisSubject.id} selected>
                                {thisSubject.name}
                              </option>
                            )
                          }
                          return (<option key={thisSubject.id} value={thisSubject.id}>
                            {thisSubject.name}
                          </option>
                          )
                        })}
                    </select>
                  </td>
                  <td style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  >
                    <button
                      style={{ marginRight: "5px" }}
                      onClick={() => confirmDeleteEvent(subject, user.id)}
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
                      onClick={(e) => showEditSubjectsUsers(e, index)}
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
                        display: "none"
                      }}
                      onClick={(e) => editEnroll(e, subject)}
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
                      onClick={(e) => closeEditSubjectsUsers(e, index)}
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
              )
            })
          })
        }
      </>
    )
  }

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchSubjectsUsers(actualPage, searchParams);
  }, [actualPage, searchParams]);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getSubjectEnrollmentFields(language),
      selectedField: getSubjectEnrollmentFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  return (
    <>
      <div className="add-form">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{language.user}</th>
              <th>{language.subject}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{language.add}:</th>
              <td>
                <Typeahead items={users?.map((user) => ({
                  id: user.user.id,
                  name: user.user.email,
                }))}
                  fieldId="user_select"
                />
              </td>
              <td>
                <select defaultValue={"-"} id="subject_select">
                  <option value="-">{language.chooseSubject}</option>
                  {
                    subjects ? subjects.map((subject) => {
                      return (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      );
                    })
                      : null
                  }
                </select>
              </td>
              <td className="action-column">
                <button onClick={createSubjectUser}>
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
                  <div id="submit-loader" className="loader">
                    {language.loading} ...
                  </div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="notify-users">
        <PageSelect
          onPageChange={(page) => setActualPage(page)}
          maxPages={maxPages}
        />
      </div>
      <div className="list-main-container" id="scroll">
        {subjectsUsers && subjectsUsers.length !== 0 ? (
          <div className="table-info">
            <table style={{ marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>{language.user}</th>
                  <th>{language.subject}</th>
                  <th>{language.actions}</th>
                </tr>
              </thead>
              <tbody>
                {memoizedSubjectsUsers()}
              </tbody>
            </table>
          </div>
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
          deleteSubjectUser(idDelete);
        }}
        onNoAction={() => {
          setPopup(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
