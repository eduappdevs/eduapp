/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState, Fragment, useCallback, useMemo, useRef } from "react";
import * as API from "../API";
import * as SCHEDULESERVICE from "../services/schedule.service";
import * as SUBJECTSERVICE from "../services/subject.service";
import Input from "./Input";
import StandardModal from "./modals/standard-modal/StandardModal";
import SessionsModal from "./modals/sessions-modal/SessionsModal";
import { interceptExpiredToken } from "../utils/OfflineManager";
import PageSelect from "./pagination/PageSelect";
import SelectedModal from "./modals/selected-modal/SelectedModal";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import useFilter from "../hooks/useFilter";
import { getSessionFields } from "../constants/search_fields";
import { LanguageCtx } from "../hooks/LanguageContext";
import ExtraFields from "./ExtraFields";
import "../styles/schedulesessionslist.css";
import { LoaderCtx } from "../hooks/LoaderContext";

export default function Schedulesessionslist(props) {
  const [loadingParams, setLoadingParams] = useContext(LoaderCtx);
  const [language] = useContext(LanguageCtx);

  const [sessions, setSessions] = useState(null);
  const [hasDoneInitialFetch, setInitialFetch] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [maxPages, setMaxPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  const [showModalSession, setShowModalSession] = useState(false);
  const [sessionInfo, setSessionInfo] = useState();
  const [selectType, setSelectType] = useState(false);
  const [selectTypeModal, setSelectTypeModal] = useState(false);
  const [selectInfo, setSelectInfo] = useState({});

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();
  const [idBatch, setIdBatch] = useState();

  const sessionBeforeEditing = useRef(null);

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);
  // const filteredSessions = useFilter(
  //   sessions,
  //   null,
  //   SCHEDULESERVICE.filterSessions,
  //   getSessionFields(language)
  // );

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

  const finalizedEdit = useCallback((type, icon, text, confirmDel) => {
    fetchSessions(actualPage);
    setIsConfirmDelete(confirmDel);
    setPopup(true);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  }, [actualPage]);

  const finalizedCreate = useCallback((type, icon, txt, confirmDel) => {
    fetchSessions(actualPage);
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
    fetchSessions(actualPage);
  }, [actualPage]);

  const connectionAlert = useCallback(async () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  }, [language]);

  const fetchSessions = useCallback(async (page, order = null, searchParams) => {
    API.asynchronizeRequest(() => {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.pagedSessions(page, order, searchParams)
        .then((us) => {
          setActualPage(us.data.page);
          setMaxPages(us.data.total_pages);
          setSessions(us.data.current_page);
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
    })
  }, []);

  const fetchSubjects = useCallback(() => {
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SUBJECTSERVICE.fetchSubjects().then((cs) => {
        setSubjects(cs.data);
        setLoadingParams({ loading: false });
      }).catch(() => {
        setLoadingParams({ loading: false });
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    })
  }, []);

  const alertCreate = useCallback(async () => {
    setPopupText(language.creationAlert);
    setPopupType("error");
    setPopup(true);
  }, []);

  const addNewSession = useCallback(async (e) => {
    switchEditState(false);

    const context = [
      "session_name",
      "session_start_date",
      "session_end_date",
      "streaming_platform",
      "resources_platform",
      "session_chat_id",
      "subject_id",
      "subject_code",
    ];

    let json = [];
    let name = document.getElementById("s_name").value;
    let start_date = document.getElementById("s_start_date").value;
    let end_date = document.getElementById("s_end_date").value;
    let resources = document.getElementById("s_resources").value;
    let streaming = document.getElementById("s_streaming").value;
    let subject = document.getElementById("s_subjectId").value;
    let subject_id = subject.split("_")[1];
    let subject_code = subject.split("_")[0];

    setLoadingParams({ loading: true });
    let chat = await SUBJECTSERVICE.fetchSubject(subject_id);
    setLoadingParams({ loading: false });

    if (
      (name !== "" &&
        start_date !== "" &&
        end_date !== "" &&
        resources !== "" &&
        streaming !== "" &&
        subject_id !== `${language.chooseSubject}` && subject_id !== "" &&
        subject_code !== `${language.chooseSubject}` && subject_code !== "")
    ) {
      json.push(
        name,
        start_date,
        end_date,
        streaming,
        resources,
        chat.data[0].chat_link,
        subject_id,
        subject_code
      );
    } else {
      finalizedCreate("error", true, language.creationFailed, false);
      return;
    }

    let SessionJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      SessionJson[context[i]] = json[i];
    }

    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.createSession(SessionJson)
        .then((e) => {
          if (e) {
            finalizedCreate("info", true, language.creationCompleted, false);
          }
          setLoadingParams({ loading: false });
        })
        .catch(async (error) => {
          if (error) {
            finalizedCreate("error", true, language.creationFailed, false);
            await interceptExpiredToken(error);
          }
          setLoadingParams({ loading: false });
        })
    }).then(async (error) => {
      if (error) {
        await interceptExpiredToken(error);
        connectionAlert();
      }
    });
  }, []);

  const confirmDeleteEvent = useCallback(async (s) => {
    finalizedDelete("warning", true, true, language.deleteAlert);
    setIdDelete(s.id);
    setIdBatch(s.batch_id);
    switchEditState(false);
  }, []);

  const deleteSession = useCallback((id, batch_id) => {
    switchEditState(false);
    if (batch_id === null) {
      API.asynchronizeRequest(function () {
        setLoadingParams({ loading: true });
        SCHEDULESERVICE.deleteSession(id)
          .then((del) => {
            if (del) {
              finalizedDelete(
                "info",
                true,
                false,
                language.deleteAlertCompleted
              );
            }
            setLoadingParams({ loading: false });
          })
          .catch(async (e) => {
            if (e) {
              finalizedDelete("error", true, false, language.deleteAlertFailed);
              await interceptExpiredToken(e);
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
      setSelectType(true);
      setSelectTypeModal(false);
      setSelectInfo({
        id: id,
      });
    }
  }, []);

  const deleteOneSession = useCallback(async () => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.deleteSession(selectInfo.id)
        .then((e) => {
          if (e) {
            finalizedDelete("info", true, false, language.deleteAlertCompleted);
          }
          setLoadingParams({ loading: false });
          setSelectTypeModal(false);
          setSelectType(false);
        })
        .catch(async (e) => {
          if (e) {
            finalizedDelete("error", true, false, language.deleteAlertFailed);
            await interceptExpiredToken(e);
          }
          setLoadingParams({ loading: false });
          setSelectTypeModal(false);
          setSelectType(false);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, [selectInfo]);

  const editSession = useCallback((e, s) => {
    switchEditState(false);
    let inputName = document.getElementById("inputName_" + s.id).value;
    let inputStartDate = document.getElementById(
      "inputStartDate_" + s.id
    ).value;
    let inputEndDate = document.getElementById("inputEndDate_" + s.id).value;
    let inputStreamPlatform = document.getElementById(
      "inputStreamPlatform_" + s.id
    ).value;
    let inputResourcePlatform = document.getElementById(
      "inputResourcePlatform_" + s.id
    ).value;
    let inputSessionChat = document.getElementById(
      "inputSessionChat_" + s.id
    ).value;
    let inputSubject = document.getElementById("inputSubjectID_" + s.id).value;

    let editTitle,
      editStartDate,
      editEndDate,
      editChat,
      editResources,
      editStream,
      editSubject,
      editCode;

    if (inputName !== "" && inputName !== s.session_name) {
      editTitle = inputName;
    } else {
      editTitle = s.session_name;
    }

    if (inputStartDate !== "" && inputStartDate !== s.session_start_date) {
      editStartDate = inputStartDate;
    } else {
      editStartDate = s.session_start_date;
    }

    if (inputEndDate !== "" && inputEndDate !== s.session_end_date) {
      editEndDate = inputEndDate;
    } else {
      editEndDate = s.session_end_date;
    }

    if (inputSessionChat !== "" && inputSessionChat !== s.session_chat_id) {
      editChat = inputSessionChat;
    } else {
      editChat = s.session_chat_id;
    }

    if (
      inputResourcePlatform !== "" &&
      inputResourcePlatform !== s.resources_platform
    ) {
      editResources = inputResourcePlatform;
    } else {
      editResources = s.resources_platform;
    }

    if (
      inputStreamPlatform !== "" &&
      inputStreamPlatform !== s.streaming_platform
    ) {
      editStream = inputStreamPlatform;
    } else {
      editStream = s.streaming_platform;
    }

    if (inputSubject !== "" && inputSubject !== s.subject.id) {
      editSubject = inputSubject;
    } else {
      editSubject = s.subject.id;
    }
    if (
      inputSubject.split("_")[0] !== "" &&
      inputSubject.split("_")[0] !== s.subject.id
    ) {
      editSubject = inputSubject.split("_")[0];
    } else {
      editSubject = s.subject.id;
    }

    // por qué es esto necesario?
    // if (
    //   inputSubject.split("_")[1] !== "" &&
    //   inputSubject.split("_")[1] !== s.subject.subject_code
    // ) {
    //   editCode = inputSubject.split("_")[1];
    // } else {
    //   editCode = s.subject.subject_code;
    // }

    API.asynchronizeRequest(function () {
      setSelectInfo({
        id: s.id,
        session_name: editTitle,
        session_start_date: editStartDate,
        session_end_date: editEndDate,
        streaming_platform: editStream,
        resources_platform: editResources,
        session_chat_id: editChat,
        subject_id: editSubject,
        // subject_code: editCode,
        batch_id: s.batch_id,
      });
      if (s.batch_id === null) {
        setLoadingParams({ loading: true });
        SCHEDULESERVICE.editSession({
          id: s.id,
          session_name: editTitle,
          session_start_date: editStartDate,
          session_end_date: editEndDate,
          streaming_platform: editStream,
          resources_platform: editResources,
          session_chat_id: editChat,
          subject_id: editSubject,
          batch_id: s.batch_id,
        })
          .then((error) => {
            if (error) {
              let num = 0;
              while (num < 4) {
                e.target.parentNode.childNodes[num].style.display === "block"
                  ? (e.target.parentNode.childNodes[num].style.display = "none")
                  : (e.target.parentNode.childNodes[num].style.display =
                    "block");
                num += 1;
              }
              let disable = 1;
              while (disable < 8) {
                e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
                disable += 1;
              }
              finalizedEdit("info", true, language.editAlertCompleted, false);
            }
            setLoadingParams({ loading: false });
          })
          .catch(async (error) => {
            if (error) {
              finalizedEdit("error", true, language.editAlertFailed, false);
              await interceptExpiredToken(error);
            }
            setLoadingParams({ loading: false });
          });
      } else {
        setSelectType(true);
        setSelectTypeModal(true);
      }
    }).then(async (error) => {
      if (error) {
        await interceptExpiredToken(error);
        connectionAlert();
      }
    });
  }, []);

  const editGlobalSession = useCallback(() => {
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.editSessionBatch({
        id: selectInfo.id,
        session_name: selectInfo.session_name,
        session_start_date: selectInfo.session_start_date,
        session_end_date: selectInfo.session_end_date,
        streaming_platform: selectInfo.streaming_platform,
        resources_platform: selectInfo.resources_platform,
        session_chat_id: selectInfo.session_chat_id,
        subject_id: selectInfo.subject_id,
        batch_id: selectInfo.batch_id,
      })
        .then((e) => {
          if (e) {
            finalizedEdit("info", true, language.editAlertCompleted, false);
          }
          setLoadingParams({ loading: false });
          setSelectType(false);
          fetchSessions(actualPage, {
            field: searchParams.selectedField,
            order: searchParams.order,
          }, searchParams);
        })
        .catch(async (e) => {
          if (e) {
            finalizedEdit("error", true, language.editAlertFailed, false);
            await interceptExpiredToken(e);
          }
          setLoadingParams({ loading: false });
        });
    }).then(async (error) => {
      if (error) {
        await interceptExpiredToken(error);
        connectionAlert();
      }
    });
  }, [selectInfo, actualPage, searchParams]);

  const editOneSession = useCallback(() => {
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.editSession({
        id: selectInfo.id,
        session_name: selectInfo.session_name,
        session_start_date: selectInfo.session_start_date,
        session_end_date: selectInfo.session_end_date,
        streaming_platform: selectInfo.streaming_platform,
        resources_platform: selectInfo.resources_platform,
        session_chat_id: selectInfo.session_chat_id,
        subject_id: selectInfo.subject_id,
        batch_id: null,
      })
        .then((e) => {
          if (e) {
            finalizedEdit("info", true, language.editAlertCompleted, false);
          }
          setLoadingParams({ loading: false });
          setSelectType(false);
          fetchSessions(actualPage, {
            field: searchParams.selectedField,
            order: searchParams.order,
          }, searchParams);
        })
        .catch(async (e) => {
          if (e) {
            finalizedEdit("error", true, language.editAlertFailed, false);
            await interceptExpiredToken(e);
          }
          setLoadingParams({ loading: false });
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  }, [selectInfo, actualPage, searchParams]);

  const closeEditSession = (e, index) => {
    let disable = 1;
    while (disable < 8) {
      e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = true;
      disable += 1;
    }

    let auxSessions = [...sessions];
    auxSessions[index] = { ...sessionBeforeEditing.current };
    setSessions(auxSessions);

    let num = 0;
    while (num < 4) {
      e.target.parentNode.childNodes[num].style.display === "block"
        ? (e.target.parentNode.childNodes[num].style.display = "none")
        : (e.target.parentNode.childNodes[num].style.display = "block");
      num += 1;
    }
  };

  const showEditOptionSession = (e, index) => {
    let disable = 1;
    while (disable < 8) {
      e.target.parentNode.parentNode.childNodes[disable].childNodes[0].disabled = false;
      disable += 1;
    }
    sessionBeforeEditing.current = { ...sessions[index] };

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

  const deleteGlobalSession = useCallback(async () => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      setLoadingParams({ loading: true });
      SCHEDULESERVICE.deleteGlobal(idBatch)
        .then((e) => {
          if (e) {
            finalizedDelete("info", true, false, language.deleteAlertCompleted);
          }
          setLoadingParams({ loading: false });
          setSelectTypeModal(false);
          setSelectType(false);
        })
        .catch((e) => {
          if (e) {
            finalizedDelete("error", true, false, language.deleteAlertFailed);
          }
          setLoadingParams({ loading: false });
          setSelectTypeModal(false);
          setSelectType(false);
        });
    }).then((e) => {
      if (e) {
        connectionAlert();
      }
    });
  }, [idBatch]);

  const showModal = useCallback(async () => {
    switchEditState(false);
    let subject_name = document.getElementById("s_subjectId").value;
    let name = document.getElementById("s_name").value;
    let streaming = document.getElementById("s_streaming").value;
    let resource = document.getElementById("s_resources").value;
    let chat = document.getElementById("s_chatGroup").value;

    let info = {
      name: name,
      streaming: streaming,
      resource: resource,
      chat: chat,
      subject: subject_name,
    };

    if (subject_name !== `${language.chooseSubject}`) {
      setShowModalSession(true);
      setSessionInfo(info);
    } else {
      let box = document.getElementById("s_dailySession").checked;
      if (box === true) {
        document.getElementById("s_dailySession").checked = false;
      }
      alertCreate();
    }
  }, []);

  const handleChange = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    const newSessions = [...sessions];
    newSessions[index][inputName] = newValue;
    setSessions(newSessions);
  }

  const handleChangeSubject = (index, value) => {
    const inputName = value.target.name
    const newValue = value.target.value
    subjects.map(s => {
      if(s.id == newValue){
        const newSessions = [...sessions];
        newSessions[index][inputName] = s;
        setSessions(newSessions);
        return
      }
    })
  }

  const memoizedSubjects = useMemo(() => {
    return subjects.map((s) => (
      <option key={s.id} value={`${s.subject_code}_${s.id}`}>
        {s.name}
      </option>
    ))
  }, [subjects]);

  const memoizedSessions = () => {
    return (
      <>
        {sessions && sessions.map((s, index) => {
          return (
            <tr key={s.id}>
              <td>{shortUUID(s.id)}</td>
              <td>
                <input
                  id={`inputName_${s.id}`}
                  name="session_name"
                  disabled
                  type="text"
                  value={s.session_name}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputStartDate_${s.id}`}
                  name="session_start_date"
                  disabled
                  type="datetime-local"
                  value={s.session_start_date}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputEndDate_${s.id}`}
                  name="session_end_date"
                  disabled
                  type="datetime-local"
                  value={s.session_end_date}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputStreamPlatform_${s.id}`}
                  name="streaming_platform"
                  disabled
                  type="text"
                  value={s.streaming_platform}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputResourcePlatform_${s.id}`}
                  name="resources_platform"
                  disabled
                  type="text"
                  value={s.resources_platform}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  id={`inputSessionChat_${s.id}`}
                  name="chat"
                  disabled
                  type="text"
                  value={s.chat}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <select id={`inputSubjectID_${s.id}`} disabled
                  name="subject"
                  onChange={(event) => handleChangeSubject(index, event)}>
                  {subjects.map((thisSubject) => {
                    if (s.subject.id == thisSubject.id) {
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
                {/* <ExtraFields table="sessions" id={s.id} /> */}
                <button
                  style={{ marginRight: "5px" }}
                  onClick={() => confirmDeleteEvent(s)}
                >
                  {/* trush_icon */}
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
                  onClick={(e) => showEditOptionSession(e, index)}
                >
                  {/* Edit_icon */}
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
                  onClick={(e) => editSession(e, s)}
                >
                  {/* check_icon */}
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
                  onClick={(e) => closeEditSession(e, index)}
                >
                  {/* cancel_icon */}
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
    );
  };

  useEffect(() => {
    // fetchSessions(1);
    fetchSubjects();
    setInitialFetch(true);
  }, []);

  useEffect(() => {
    fetchSessions(actualPage, {
      field: searchParams.selectedField,
      order: searchParams.order,
    }, searchParams);
  }, [searchParams, actualPage]);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getSessionFields(language),
      selectedField: getSessionFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  // useEffect(() => {
  //   if (hasDoneInitialFetch) {
  //     fetchSessions(1, {
  //       field: searchParams.selectedField,
  //       order: searchParams.order,
  //     });
  //   }
  // }, [searchParams.order]);

  return (
    <>
      <div className="add-form">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{language.name}</th>
              <th>{language.streaming}</th>
              <th>{language.resources}</th>
              <th>{language.chat}</th>
              <th>{language.subjects}</th>
              <th>{language.repeated}</th>
              <th>{language.startDate}</th>
              <th>{language.endDate}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{language.add}:</td>
              <td>
                <Input
                  id="s_name"
                  type="text"
                  placeholder={language.name}
                  autoComplete="off"
                />
              </td>
              <td>
                <Input id="s_streaming" type="text" placeholder="Streaming" />
              </td>
              <td>
                <Input
                  id="s_resources"
                  type="text"
                  placeholder={language.resources}
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  id="s_chatGroup"
                  type="text"
                  placeholder={language.chat}
                  autoComplete="off"
                />
              </td>
              <td className="subjecButton">
                <select id="s_subjectId">
                  <option defaultValue={language.chooseSubject}>
                    {language.chooseSubject}
                  </option>
                  {memoizedSubjects}
                </select>
              </td>
              <td>
                <input
                  id="s_dailySession"
                  type="checkbox"
                  onClick={() => {
                    showModal();
                  }}
                />
              </td>
              <td>
                <Input
                  id="s_start_date"
                  type="datetime-local"
                  placeholder={language.startDate}
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  id="s_end_date"
                  type="datetime-local"
                  placeholder={language.endDate}
                  autoComplete="off"
                />
              </td>
              <td className="action-column">
                <button onClick={addNewSession}>
                  {/* add_icon */}
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
                  {/* Reload icon */}
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
          onPageChange={(p) => setActualPage(p)}
          maxPages={maxPages}
        />
      </div>
      <div className="list-main-container" id="scroll">
        {sessions && sessions.length !== 0 ? (
          <div className="table-info">
            <table style={{ marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>{language.code}</th>
                  <th>{language.name}</th>
                  <th>{language.startDate}</th>
                  <th>{language.endDate}</th>
                  <th>{language.streaming}</th>
                  <th>{language.resources}</th>
                  <th>{language.chat}</th>
                  <th>{language.subjects}</th>
                  <th>{language.actions}</th>
                </tr>
              </thead>
              <tbody>
                {memoizedSessions()}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <SelectedModal
        show={selectType}
        editGlobal={() => {
          editGlobalSession();
        }}
        deleteGlobal={() => {
          deleteGlobalSession();
        }}
        editOne={() => {
          editOneSession();
        }}
        deleteOne={() => {
          deleteOneSession();
        }}
        selectTypeModal={selectTypeModal}
        onCloseModal={() => {
          setSelectType(false);
          switchEditState(true);
        }}
        language={language}
      />

      <SessionsModal
        show={showModalSession}
        language={language}
        info={sessionInfo}
        onCloseModal={() => {
          setShowModalSession(false);
          let box = document.getElementById("s_dailySession").checked;
          if (box === true) {
            document.getElementById("s_dailySession").checked = false;
          }
          fetchSessions(actualPage);
        }}
      ></SessionsModal>
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setPopup(false);
          deleteSession(idDelete, idBatch);
          setIsConfirmDelete(false);
        }}
        onNoAction={() => {
          setPopup(false);
          setSelectType(false);
          switchEditState(true);
        }}
        onCloseAction={() => {
          setPopup(false);
          setSelectType(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
