/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useCallback, useContext, useEffect, useState, useMemo } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as COURSESERVICE from "../services/course.service";
import * as CHATSERVICE from "../services/chat.service";
import StandardModal from "./modals/standard-modal/StandardModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import PageSelect from "./pagination/PageSelect";
import useFilter from "../hooks/useFilter";
import { getSubjectFields } from "../constants/search_fields";
import ExtraFields from "./ExtraFields";
import { LanguageCtx } from "../hooks/LanguageContext";
import "../styles/subjectsConfig.css";
import { LoaderCtx } from "../hooks/LoaderContext";

export default function SubjectsConfig() {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [language] = useContext(LanguageCtx);

  const [subjects, setSubjects] = useState([]);
  const [hasDoneInitialFetch, setInitialFetch] = useState(false);
  const [courses, setCourses] = useState([]);
  const [chats, setChats] = useState([]);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);

  const shortUUID = useCallback((uuid) => uuid.substring(0, 8), []);

  const switchEditState = useCallback((state) => {
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
  }, []);

  const connectionAlert = useCallback(() => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  }, []);

  const fetchCourses = useCallback(() => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.fetchCourses().then((cs) => {
        setCourses(cs.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const fetchChats = useCallback(() => {
    API.asynchronizeRequest(function () {
      CHATSERVICE.fetchChat().then((chats) => {
        setChats(chats.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const alertCreate = useCallback(async () => {
    switchEditState(false);
    setPopupText(language.creationAlert);
    setPopupType("error");
    setPopup(true);
  }, []);

  const finalizedCreate = useCallback((type, icon, txt, confirmDel) => {
    fetchSubjectPage(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(txt);
  }, []);

  const createSubject = useCallback(() => {
    switchEditState(false);
    let subject_code = document.getElementById("sj_subjectCode").value;
    let name = document.getElementById("sj_name").value;
    let desc = document.getElementById("sj_desc").value;
    let color = document.getElementById("sj_color").value;
    let sel_course = document.getElementById("course_chooser").value;
    let chat_link = document.getElementById("chat_chooser").value;

    let info = [subject_code, name, desc, color, sel_course, chat_link];

    let valid = true;
    for (let i of info) {
      if (i.length < 2 && i === "-" && i === "") {
        valid = false;
        break;
      }
    }

    if (valid) {
      API.asynchronizeRequest(function () {
        SUBJECTSERVICE.createSubject({
          subject_code: subject_code,
          name: name,
          description: desc,
          color: color,
          course_id: sel_course,
          chat_link: chat_link === "-" ? null : chat_link,
        })
          .then((e) => {
            if (e) {
              finalizedCreate("info", true, language.creationCompleted, false);
            }
          })
          .catch(async (e) => {
            if (e) {
              await interceptExpiredToken(e);
              finalizedCreate("error", true, language.creationFailed, false);
            }
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
  }, []);

  const confirmDeleteEvent = useCallback(async (id) => {
    finalizedDelete("warning", true, true, language.deleteAlert);
    switchEditState(false);
    setIdDelete(id);
  }, []);

  const finalizedDelete = useCallback((type, icon, confirmDel, text) => {
    switchEditState(false);
    setPopupType(type);
    setPopupIcon(icon);
    setPopup(true);
    setPopupText(text);
    setIsConfirmDelete(confirmDel);
    fetchSubjectPage(actualPage);
  }, []);

  const deleteSubject = useCallback((id) => {
    switchEditState(false);
    //eliminar sessiones + modal de aviso y mostrar las sessiones que se eliminarán
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.deleteSubject(id)
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
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const showEditOptionSubject = useCallback((e) => {
    let disable = 1;
    while (disable < 8) {
      e.target.parentNode.parentNode.childNodes[
        disable
      ].childNodes[0].disabled = false;
      disable += 1;
    }
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
  }, []);

  const finalizedEdit = useCallback((type, icon, pop, text, confirmDel) => {
    fetchSubjectPage(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(pop);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  }, []);

  const editSubject = useCallback((e, subject) => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.editSubject({
        id: subject.id,
        subject_code: subject.subject_code,
        external_id: subject.external_id,
        name: subject.name,
        description: subject.description,
        color: subject.color,
        course_id: subject.course_id,
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
            let disable = 1;
            while (disable < 5) {
              e.target.parentNode.parentNode.childNodes[
                disable
              ].childNodes[0].disabled = true;
              disable += 1;
            }
            finalizedEdit(
              "info",
              true,
              true,
              language.editAlertCompleted,
              false
            );
          }
        })
        .catch(async (error) => {
          if (error) {
            await interceptExpiredToken(e);
            finalizedEdit("error", true, true, language.editAlertFailed, false);
          }
        });
    }).then(async (error) => {
      if (error) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const closeEditSubject = useCallback((e) => {
    e.preventDefault();
    let disable = 1;
    while (disable < 5) {
      e.target.parentNode.parentNode.childNodes[
        disable
      ].childNodes[0].disabled = true;
      disable += 1;
    }
    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  }, []);

  const fetchSubjectPage = useCallback(async (page, order = null, searchParams) => {
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SUBJECTSERVICE.pagedSubjects(page, order, searchParams)
        .then((us) => {
          setMaxPages(us.data.total_pages);
          setSubjects(us.data.current_page);
          setActualPage(us.data.page);
          fetchCourses();
          setLoadingParams({ loading: false });
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          setLoadingParams({ loading: false });
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, []);

  const handleChange = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    const newSubjects = [...subjects];
    newSubjects[index][inputName] = newValue;
    setSubjects(newSubjects);
  }

  const memoizedSubjects = useMemo(() => {
    return (
      <>
        {subjects && subjects.map((subject, index) => {
          return (
            <tr key={subject.id}>
              <td>
                <input disabled type="text" value={subject.id} />
              </td>
              <td>
                <input
                  id={`inputSubjectCode_${subject.id}`}
                  name="subject_code"
                  disabled
                  type="text"
                  value={subject.subject_code}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputExternaId_${subject.id}`}
                  name="external_id"
                  disabled
                  type="text"
                  value={subject.external_id}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>

              <td>
                <input
                  id={`inputName_${subject.id}`}
                  name="name"
                  disabled
                  type="text"
                  value={subject.name}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputDescription_${subject.id}`}
                  name="description"
                  disabled
                  type="text"
                  value={subject.description}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputColor_${subject.id}`}
                  name="color"
                  disabled
                  type="color"
                  value={subject.color}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input disabled type="text" value={subject.course.name} />
              </td>
              <td>
                <select disabled defaultValue={subject.chat_link} id="chat_chooser">
                  <option value="-">{language.noChatSelected}</option>
                  {chats
                    ? chats.map((ch) => {
                      if (ch.isGroup) {
                        return (
                          <option key={ch.id} value={ch.id}>
                            {ch.chat_name}
                          </option>
                        );
                      }
                    })
                    : null}
                </select>
              </td>
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <ExtraFields table="subjects" id={subject.id} /> */}
                <button
                  style={{ marginRight: "5px" }}
                  onClick={() => confirmDeleteEvent(subject.id)}
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
                  onClick={(e) => showEditOptionSubject(e)}
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
                  onClick={(e) => editSubject(e, subject)}
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
                  onClick={(e) => closeEditSubject(e, subject)}
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
      </>
    )
  }, [subjects]);

  useEffect(() => {
    // fetchSubjectPage(1);
    fetchCourses();
    fetchChats();
    setInitialFetch(true);
  }, []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getSubjectFields(language),
      selectedField: getSubjectFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  useEffect(() => {
    if (searchParams.selectedField) {
      fetchSubjectPage(
        actualPage || 1,
        {
          field: searchParams.selectedField,
          order: searchParams.order,
        },
        searchParams
      );
    }
  }, [searchParams]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{language.subjectCode}</th>
              <th>{language.externalId}</th>
              <th>{language.name}</th>
              <th>{language.description}</th>
              <th>{language.color}</th>
              <th>{language.linkedCourse}</th>
              {/* <th>{language.linkedChat}</th> */}
              <th></th>
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
                  id="sj_subjectCode"
                  placeholder={language.subjectCode}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="sj_externalId"
                  placeholder={language.externalId}
                />
              </td>
              <td>
                <input id="sj_name" type="text" placeholder={language.name} />
              </td>
              <td>
                <input
                  id="sj_desc"
                  type="text"
                  placeholder={language.description}
                />
              </td>
              <td>
                <input
                  id="sj_color"
                  type="color"
                  placeholder={language.description}
                />
              </td>
              <td>
                <select defaultValue={"-"} id="course_chooser">
                  <option value="-">{language.chooseCourse}</option>
                  {courses
                    ? courses.map((c) => {
                      return (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      );
                    })
                    : null}
                </select>
              </td>
              <td>
                <select defaultValue={"-"} id="chat_chooser">
                  <option value="-">{language.chooseChat}</option>
                  {chats
                    ? chats.map((ch) => {
                      if (ch.isGroup) {
                        return (
                          <option key={ch.id} value={ch.id}>
                            {ch.chat_name}
                          </option>
                        );
                      }
                    })
                    : null}
                </select>
              </td>
              <td className="action-column">
                <button onClick={createSubject}>
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
                  <div id="submit-loader" className="loader">
                    {language.loading} ...
                  </div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {subjects && subjects.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => setActualPage(p)}
                maxPages={maxPages}
              />
            </div>
            <div className="subjects-table-info">
              <table className="eventList" style={{ marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th>{language.code}</th>
                    <th>{language.subjectCode}</th>
                    <th>{language.externalId}</th>
                    <th>{language.name}</th>
                    <th>{language.description}</th>
                    <th>{language.color}</th>
                    <th>{language.linkedCourse}</th>
                    <th>{language.linkedChat}</th>
                    <th>{language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {memoizedSubjects}
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
          setIsConfirmDelete(false);
          deleteSubject(idDelete);
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
