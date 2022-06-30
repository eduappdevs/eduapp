/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState } from "react";
import { asynchronizeRequest } from "../API";
import { interceptExpiredToken } from "../utils/OfflineManager";
import * as SUBJECT_SERVICE from "../services/subject.service";
import * as USER_SERVICE from "../services/user.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import PageSelect from "./pagination/PageSelect";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import useFilter from "../hooks/useFilter";
import { getTeacherFields } from "../constants/search_fields";

export default function TeacherConfig() {
  const [language] = useContext(LanguageCtx);

  const [users, setUsers] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [teachers, setTeachers] = useState(null);

  const [maxPages, setMaxPages] = useState(1);
  const [teacherPages, setTeacherPages] = useState();

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setUserIdDelete] = useState();
  const [subjectDelete, setSubjectIdDelete] = useState();

  const [, setSearchParams] = useContext(SearchBarCtx);
  const filteredTeachers = useFilter(
    teachers,
    null,
    USER_SERVICE.filterTeachers,
    getTeacherFields(language)
  );

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "100vw";
      document.getElementById("standard-modal").style.height = "100vw";
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "hidden";
    }
  };
  const fetchUsers = async () => {
    return await asynchronizeRequest(async function () {
      let rawUsers = await USER_SERVICE.fetchUserInfos();
      await interceptExpiredToken(rawUsers);
      rawUsers = rawUsers.data.filter((user) =>
        ["eduapp-teacher", "eduapp-admin"].includes(user.user_role.name)
      );
      let sysUserI = rawUsers.indexOf(
        rawUsers.find((u) => u.user_name === "eduapp_system")
      );
      rawUsers.splice(sysUserI, 1);
      return rawUsers;
    });
  };

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  };

  const fetchSubjects = async () => {
    return await asynchronizeRequest(async function () {
      let rawSubjects = await SUBJECT_SERVICE.fetchSubjects();
      await interceptExpiredToken(rawSubjects);
      return rawSubjects.data;
    });
  };

  const formatTeachers = (users, subjects) => {
    let allTeachers = [];
    let allSubjectIds = function () {
      let ids = [];
      for (let i = 0; i < subjects.length; i++) {
        ids.push(subjects[i].id);
      }
      return ids;
    };

    for (let u of users) {
      for (let subject_id of u.teaching_list) {
        if (allSubjectIds().includes(subject_id)) {
          allTeachers.push({
            user: u,
            subject: subjects.find((s) => s.id === subject_id),
          });
        }
      }
    }

    let pages = 0;
    let max = 0;
    let listAllTeacher = [];
    let teacher = [];
    for (var i = 0; i < allTeachers.length; i++) {
      if (max === 9) {
        pages += 1;
        max = 0;
        teacher.push(allTeachers[i]);
        listAllTeacher.push(teacher);
        teacher = [];
      }
      if (max < 9) {
        max += 1;
        teacher.push(allTeachers[i]);
      }
    }

    if (pages > 1) {
      for (let i = 10; i > allTeachers.length; i++) {
        teacher.push(allTeachers[i]);
      }
    }

    listAllTeacher.push(teacher);
    teacher = [];
    pages += 1;

    setMaxPages(pages);
    setTeacherPages(listAllTeacher);
    setTeachers(allTeachers);
  };

  const fetchTeacherPages = async (pages) => {
    let teacherFilter = [];
    if (maxPages === pages) {
      teacherPages[pages - 1].forEach((t) => {
        teacherFilter.push(t);
      });
    } else {
      teacherPages[pages - 1].forEach((t) => {
        teacherFilter.push(t);
      });
    }
    setTeachers(teacherFilter);
  };

  const alertCreate = async () => {
    switchEditState(false);
    setPopupText(language.creationAlert);
    setPopupType("error");
    setPopup(true);
    setIsConfirmDelete(false);
  };

  const createTeacher = async () => {
    switchEditState(false);

    const user = document.getElementById("user_select").value;
    const subject = document.getElementById("subject_select").value;

    if (user === "-" || subject === "-") return alertCreate();

    asynchronizeRequest(async () => {
      await USER_SERVICE.enroll_teacher(user, subject)
        .then((e) => {
          if (e) {
            setPopup(true);
            setPopupType("info");
            setPopupText(language.creationCompleted);
            switchSaveState(true);
            setIsConfirmDelete(false);
            fetchTeacherPages(1);
            refreshTeachers();
          }
        })
        .catch(async (e) => {
          if (e) {
            await interceptExpiredToken(e);
            alertCreate();
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const refreshTeachers = () => {
    fetchUsers()
      .then((users) => {
        fetchSubjects().then((subjects) => {
          setUsers(users);
          setSubjects(subjects);
          if (subjects && users) {
            formatTeachers(users, subjects);
          }
        });
      })
      .catch(async (err) => {
        await interceptExpiredToken(err);
        console.error(err);
      });
  };

  const confirmDeleteTeacher = async (userId, subjId) => {
    switchEditState(false);
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText(language.deleteAlert);
    setIsConfirmDelete(true);
    setPopup(true);
    setUserIdDelete(userId);
    setSubjectIdDelete(subjId);
  };

  const showDeleteError = () => {
    switchEditState(false);
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText(language.deleteError);
    setIsConfirmDelete(false);
  };

  const deleteTeacher = async (uId, sId) => {
    switchEditState(false);

    asynchronizeRequest(async () => {
      USER_SERVICE.delist_teacher(uId, sId)
        .then(() => {
          refreshTeachers();
          fetchTeacherPages(1);
          setPopup(true);
          setPopupType("info");
          setPopupText(language.deleteAlertCompleted);
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
        connectionAlert();
      }
    });
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

  useEffect(() => {
    refreshTeachers();
  }, []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getTeacherFields(language),
      selectedField: getTeacherFields(language)[0][0],
    });
  }, [language]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table>
          <thead>
            <tr>
              <th>{language.add}</th>
              <th>{language.user}</th>
              <th>{language.subjectToTeach}</th>
            </tr>
          </thead>
          <tbody>
            <tr key={"newTuition"}>
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button onClick={createTeacher}>
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
                <select defaultValue={"-"} id="user_select">
                  <option value="-">{language.chooseUser}</option>
                  {users
                    ? users.map((u) => {
                        return (
                          <option key={u.id} value={u.user.id}>
                            {u.user_name}
                          </option>
                        );
                      })
                    : null}
                </select>
              </td>
              <td>
                <select defaultValue={"-"} id="subject_select">
                  <option value="-">{language.chooseSubject}</option>
                  {subjects
                    ? subjects.map((s) => {
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        );
                      })
                    : null}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        {teachers && teachers.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchTeacherPages(p)}
                maxPages={maxPages}
              />
            </div>
            <div className="courses-table-info">
              <table style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>{language.teacherName}</th>
                    <th>{language.subjectName}</th>
                    <th>{language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => {
                    if (filteredTeachers !== null)
                      if (
                        filteredTeachers.find(
                          (ft) => t.user.id === ft.user.id
                        ) === undefined
                      )
                        return <Fragment key={i} />;
                    return (
                      <tr key={i}>
                        <td>
                          <input
                            type="text"
                            disabled
                            value={t.user.user_name}
                          />
                        </td>
                        <td>
                          <input type="text" disabled value={t.subject.name} />
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
                              confirmDeleteTeacher(
                                t.user.user.id,
                                t.subject.id
                              );
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
          deleteTeacher(idDelete, subjectDelete);
        }}
        onNoAction={() => {
          setPopup(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          switchSaveState();
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
