/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState, Fragment } from "react";
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

export default function Schedulesessionslist(props) {
  const [language] = useContext(LanguageCtx);

  const [sessions, setSessions] = useState(null);
  const [subject, setSubject] = useState([]);

  const [maxPages, setMaxPages] = useState(1);

  const [subjectEdit, setSubjectEdit] = useState([]);
  const [newStartDate] = useState();
  const [newEndDate] = useState();
  const [newName] = useState();
  const [newStreamPlatform] = useState();
  const [newResourcesPlatform] = useState();
  const [newChatId] = useState();

  const [changeEndDate, setChangeEndDate] = useState(false);
  const [changeStartDate, setChangeStartDate] = useState(false);
  const [changeName, setChangeName] = useState(false);
  const [changeResourcesPlatform, setChangeResourcesPlatform] = useState(false);
  const [changeChatId, setChangeChatId] = useState(false);
  const [changeStreamPlatform, setChangeStreamPlatform] = useState(false);

  const [showModalSession, setShowModalSession] = useState(false);
  const [sessionInfo, setSessionInfo] = useState();
  const [selectType, setSelectType] = useState(false);
  const [selectTypeModal, setSelectTypeModal] = useState(false);
  const [selectInfo, setSelectInfo] = useState([]);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();
  const [idBatch, setIdBatch] = useState();

  const [, setSearchParams] = useContext(SearchBarCtx);
  const filteredSessions = useFilter(
    sessions,
    null,
    SCHEDULESERVICE.filterSessions,
    getSessionFields(language)
  );

  const shortUUID = (uuid) => uuid.substring(0, 8);

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

  const connectionAlert = async () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  };

  const fetchSessions = async (pages) => {
    await API.asynchronizeRequest(function () {
      SCHEDULESERVICE.pagedSessions(pages)
        .then((e) => {
          setMaxPages(e.data.total_pages);
          setSessions(e.data.current_page);
        })
        .catch(async (e) => {
          await interceptExpiredToken(e);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchSubjects = async () => {
    await API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects()
        .then((res) => {
          res.data.shift();
          setSubject(res.data);
        })
        .catch(async (e) => {
          await interceptExpiredToken(e);
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const alertCreate = async () => {
    switchEditState(false);
    setPopupText(language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const AddNewSession = (e) => {
    e.preventDefault();
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
    let chat = 1;
    let subject = document.getElementById("s_subjectId").value;
    let subject_id = subject.split("_")[1];
    let subject_code = subject.split("_")[0];

    if (
      (name !== "" &&
        start_date !== "" &&
        end_date !== "" &&
        resources !== "" &&
        streaming !== "" &&
        chat !== "" &&
        subject_id !== `${language.chooseSubject}` &&
        subject_id !== "",
      subject_code !== `${language.chooseSubject}` && subject_code !== "")
    ) {
      json.push(
        name,
        start_date,
        end_date,
        streaming,
        resources,
        chat,
        subject_id,
        subject_code
      );
    } else {
      alertCreate();
      switchSaveState(false);
      return;
    }

    let SessionJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      SessionJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.createSession(SessionJson)
        .then((error) => {
          if (error) {
            fetchSessions(1);
            setPopup(true);
            setPopupType("info");
            setPopupText(language.creationCompleted);
            setIsConfirmDelete(false);
          }
        })
        .catch(async (error) => {
          await interceptExpiredToken(error);
          setPopup(true);
          setPopupText(language.creationFailed);
          setIsConfirmDelete(false);
          setPopupIcon("error");
          switchSaveState(false);
        });
    }).then(async (error) => {
      if (error) {
        await interceptExpiredToken(error);
        connectionAlert();
      }
    });
  };

  const confirmDeleteEvent = async (s) => {
    switchEditState(false);
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText(language.deleteAlert);
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(s.id);
    setIdBatch(s.batch_id);
  };

  const deleteSession = async (id, batch_id) => {
    switchEditState(false);
    if (batch_id === null) {
      API.asynchronizeRequest(function () {
        SCHEDULESERVICE.deleteSession(id)
          .then((del) => {
            if (del) {
              fetchSessions(1);
              setPopup(true);
              setPopupType("info");
              setPopupText(language.deleteAlertCompleted);
              setIsConfirmDelete(false);
              switchSaveState(false);
            }
          })
          .catch(async (e) => {
            await interceptExpiredToken(e);
            setPopupType("error");
            popupIcon(false);
            setPopup(false);
            setPopupText(language.deleteFailed);
            setIsConfirmDelete(false);
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
  };

  const deleteOneSession = async () => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.deleteSession(selectInfo.id)
        .then(() => {
          fetchSessions(1);
          setPopup(true);
          setPopupType("info");
          setPopupText(language.deleteAlertCompleted);
          setIsConfirmDelete(false);
          switchSaveState(false);
        })
        .catch(async (e) => {
          await interceptExpiredToken(e);
          setPopupType("error");
          popupIcon(false);
          setPopup(false);
          setPopupText(language.deleteFailed);
          setIsConfirmDelete(false);
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
      document
        .getElementById("commit-loader-2")
        .classList.remove("commit-loader-hide");
      document.getElementById("add-svg").classList.add("commit-loader-hide");
    } else {
      document.getElementById("add-svg").classList.remove("commit-loader-hide");
      document
        .getElementById("commit-loader-2")
        .classList.add("commit-loader-hide");
    }
  };

  const editSession = (e, s) => {
    switchEditState(false);
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let streaming =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let resources =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let chat =
        e.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
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
      let inputSubject = document.getElementById(
        "inputSubjectID_" + s.id
      ).value;
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

      if (
        inputSubject.split("_")[0] !== "" &&
        inputSubject.split("_")[0] !== s.subject.id
      ) {
        editSubject = inputSubject.split("_")[0];
      } else {
        editSubject = s.subject.id;
      }

      if (
        inputSubject.split("_")[1] !== "" &&
        inputSubject.split("_")[1] !== s.subject.subject_code
      ) {
        editCode = inputSubject.split("_")[1];
      } else {
        editCode = s.subject.subject_code;
      }

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
          subject_code: editCode,
          batch_id: s.batch_id,
        });
        if (s.batch_id === null) {
          SCHEDULESERVICE.editSession({
            id: s.id,
            session_name: editTitle,
            session_start_date: editStartDate,
            session_end_date: editEndDate,
            streaming_platform: editStream,
            resources_platform: editResources,
            session_chat_id: editChat,
            subject_id: editSubject,
          })
            .then((error) => {
              if (error) {
                let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
                buttonDelete.style.display = "block";
                let button = e.target.parentNode.parentNode.childNodes[1];
                button.style.display = "block";
                let checkButton = e.target.parentNode.parentNode.childNodes[2];
                checkButton.style.display = "none";
                let cancelButton = e.target.parentNode.parentNode.childNodes[3];
                cancelButton.style.display = "none";
                name.disabled = true;
                startDate.disabled = true;
                endDate.disabled = true;
                streaming.disabled = true;
                resources.disabled = true;
                chat.disabled = true;
                subject.disabled = true;
                setPopup(true);
                setPopupType("info");
                setPopupText(language.editAlertCompleted);
                switchSaveState(false);
                setIsConfirmDelete(false);
                fetchSessions(1);
              }
            })
            .catch(async (error) => {
              if (error) {
                await interceptExpiredToken(error);
                setPopupText(language.editAlertFailed);
                setPopupIcon("error");
                switchSaveState(false);
                setPopup(true);
              }
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
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]
            .childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[5]
            .childNodes[0];
        let chat =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[6]
            .childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[7]
            .childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputStartDate = document.getElementById(
          "inputStartDate_" + s.id
        ).value;
        let inputEndDate = document.getElementById(
          "inputEndDate_" + s.id
        ).value;
        let inputStreamPlatform = document.getElementById(
          "inputStreamPlatform_" + s.id
        ).value;
        let inputResourcePlatform = document.getElementById(
          "inputResourcePlatform_" + s.id
        ).value;
        let inputSessionChat = document.getElementById(
          "inputSessionChat_" + s.id
        ).value;
        let inputSubject = document.getElementById(
          "inputSubjectID_" + s.id
        ).value;
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

        if (
          inputSubject.split("_")[0] !== "" &&
          inputSubject.split("_")[0] !== s.subject.id
        ) {
          editSubject = inputSubject.split("_")[0];
        } else {
          editSubject = s.subject.id;
        }

        if (
          inputSubject.split("_")[1] !== "" &&
          inputSubject.split("_")[1] !== s.subject.subject_code
        ) {
          editCode = inputSubject.split("_")[1];
        } else {
          editCode = s.subject.subject_code;
        }

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
            subject_code: editCode,
            batch_id: s.batch_id,
          });
          if (s.batch_id === null) {
            SCHEDULESERVICE.editSession({
              id: s.id,
              session_name: editTitle,
              session_start_date: editStartDate,
              session_end_date: editEndDate,
              streaming_platform: editStream,
              resources_platform: editResources,
              session_chat_id: editChat,
              subject_id: editSubject,
            })
              .then((error) => {
                if (error) {
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
                  startDate.disabled = true;
                  endDate.disabled = true;
                  streaming.disabled = true;
                  resources.disabled = true;
                  chat.disabled = true;
                  subject.disabled = true;
                  setPopupType("info");
                  setPopupText(language.editAlertCompleted);
                  setIsConfirmDelete(false);
                  setPopup(true);
                  fetchSessions(1);
                }
              })
              .catch(async (error) => {
                if (error) {
                  await interceptExpiredToken(error);
                  setPopupText(language.editAlertFailed);
                  setPopupIcon("error");
                  switchSaveState(false);
                  setIsConfirmDelete(false);
                  setPopup(true);
                }
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
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let chat = e.target.parentNode.parentNode.childNodes[6].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputStartDate = document.getElementById(
          "inputStartDate_" + s.id
        ).value;
        let inputEndDate = document.getElementById(
          "inputEndDate_" + s.id
        ).value;
        let inputStreamPlatform = document.getElementById(
          "inputStreamPlatform_" + s.id
        ).value;
        let inputResourcePlatform = document.getElementById(
          "inputResourcePlatform_" + s.id
        ).value;
        let inputSessionChat = document.getElementById(
          "inputSessionChat_" + s.id
        ).value;
        let inputSubject = document.getElementById(
          "inputSubjectID_" + s.id
        ).value;

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

        if (
          inputSubject.split("_")[1] !== "" &&
          inputSubject.split("_")[1] !== s.subject.subject_code
        ) {
          editCode = inputSubject.split("_")[1];
        } else {
          editCode = s.subject.subject_code;
        }

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
            subject_code: editCode,
            batch_id: s.batch_id,
          });
          if (s.batch_id === null) {
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
                  fetchSessions(1);
                  let buttonDelete = e.target.parentNode.childNodes[0];
                  buttonDelete.style.display = "block";
                  let button = e.target.parentNode.childNodes[1];
                  button.style.display = "block";
                  let checkButton = e.target.parentNode.childNodes[2];
                  checkButton.style.display = "none";
                  let cancelButton = e.target.parentNode.childNodes[3];
                  cancelButton.style.display = "none";
                  name.disabled = true;
                  startDate.disabled = true;
                  endDate.disabled = true;
                  streaming.disabled = true;
                  resources.disabled = true;
                  chat.disabled = true;
                  subject.disabled = true;
                  setPopupType("info");
                  setPopupText(language.editAlertCompleted);
                  switchSaveState(false);
                  setIsConfirmDelete(false);
                  setPopup(true);
                }
              })
              .catch(async (error) => {
                if (error) {
                  await interceptExpiredToken(error);
                  setPopupText(language.editAlertFailed);
                  setPopupIcon("error");
                  switchSaveState(false);
                  setPopup(true);
                  setIsConfirmDelete(false);
                }
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
      }
    }
  };

  const editGlobalSession = () => {
    API.asynchronizeRequest(function () {
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
            setPopup(true);
            setPopupType("info");
            setPopupText(language.editAlertCompleted);
            switchSaveState(false);
            setIsConfirmDelete(false);
            fetchSessions(1);
          }
        })
        .catch((e) => {
          if (e) {
            setPopupText(language.editAlertFailed);
            setPopupIcon("error");
            switchSaveState(false);
            setPopup(true);
            setIsConfirmDelete(false);
          }
        });
    }).then(async (error) => {
      if (error) {
        await interceptExpiredToken(error);
        connectionAlert();
      }
    });
  };

  const editOneSession = () => {
    API.asynchronizeRequest(function () {
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
        .then(() => {
          fetchSessions(1);
          setPopup(true);
          setPopupType("info");
          setPopupText(language.editAlertCompleted);
          switchSaveState(false);
          setIsConfirmDelete(false);
        })
        .catch((e) => {
          if (e) {
            setPopupText(language.editAlertFailed);
            setPopupIcon("error");
            switchSaveState(false);
            setPopup(true);
            setIsConfirmDelete(false);
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const closeEditSession = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let streaming =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let resources =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let chat =
        e.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      name.disabled = true;
      startDate.disabled = true;
      endDate.disabled = true;
      streaming.disabled = true;
      resources.disabled = true;
      chat.disabled = true;
      subject.disabled = true;
      let buttonDelete = e.target.parentNode.parentNode.childNodes[0];
      buttonDelete.style.display = "block";
      let button = e.target.parentNode.parentNode.childNodes[1];
      button.style.display = "block";
      let checkButton = e.target.parentNode.parentNode.childNodes[2];
      checkButton.style.display = "none";
      let cancelButton = e.target.parentNode.parentNode.childNodes[3];
      cancelButton.style.display = "none";
      let content = document.getElementById(`inputSubjectID_${s.id}`).value;
      if (s.subject.id !== parseInt(content.value)) {
        content = s.subject.id;
      }
    } else {
      if (e.target.tagName === "path") {
        let name =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[1].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[5].childNodes[0];
        let chat =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[6].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[7].childNodes[0];
        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        streaming.disabled = true;
        resources.disabled = true;
        chat.disabled = true;
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
        let content = document.getElementById(`inputSubjectID_${s.id}`).value;
        if (s.subject.id !== parseInt(content.value)) {
          content = s.subject.id;
        }
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let chat = e.target.parentNode.parentNode.childNodes[6].childNodes[0];
        let subjectValue =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];
        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        streaming.disabled = true;
        resources.disabled = true;
        chat.disabled = true;
        subjectValue.disabled = true;
        let buttonDelete = e.target.parentNode.childNodes[0];
        buttonDelete.style.display = "block";
        let button = e.target.parentNode.childNodes[1];
        button.style.display = "block";
        let checkButton = e.target.parentNode.childNodes[2];
        checkButton.style.display = "none";
        let cancelButton = e.target.parentNode.childNodes[3];
        cancelButton.style.display = "none";
        let content = document.getElementById(`inputSubjectID_${s.id}`).value;
        if (s.subject.id !== parseInt(content.value)) {
          content = s.subject.id;
        }
      }
    }
  };

  const showEditOptionSession = (e, S) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0];
      let streaming =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let resources =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let chat =
        e.target.parentNode.parentNode.parentNode.childNodes[6].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      name.disabled = false;
      startDate.disabled = false;
      endDate.disabled = false;
      streaming.disabled = false;
      resources.disabled = false;
      chat.disabled = false;
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
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[3]
            .childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let resources =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[5]
            .childNodes[0];
        let chat =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[6]
            .childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[7]
            .childNodes[0];
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        streaming.disabled = false;
        resources.disabled = false;
        chat.disabled = false;
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
        let startDate =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[3].childNodes[0];
        let streaming =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let resources =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let chat = e.target.parentNode.parentNode.childNodes[6].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        streaming.disabled = false;
        resources.disabled = false;
        chat.disabled = false;
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

  const deleteGlobalSession = async () => {
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.deleteGlobal(idBatch)
        .then((e) => {
          if (e) {
            fetchSessions(1);
            setPopup(true);
            setPopupType("info");
            setPopupText(language.deleteAlertCompleted);
            switchSaveState(false);
            setSelectType(false);
            fetchSessions(1);
          }
        })
        .catch((e) => {
          if (e) {
            setPopupText(language.deleteFailed);
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
  };

  const listSubject = (sub) => {
    let list_subject = [];
    subject.map((s) => {
      if (s.id !== parseInt(sub)) {
        list_subject.push(s);
      }
      return true;
    });
    setSubjectEdit(list_subject);
  };

  const handleChangeEndDate = (id) => {
    setChangeEndDate(true);
    return document.getElementById("inputEndDate_" + id).value;
  };

  const handleChangeStartDate = (e, id) => {
    setChangeStartDate(true);
    return e.target.value;
  };

  const handleChangeName = (id) => {
    setChangeName(true);
    return document.getElementById(`inputName_${id}`).value;
  };

  const handleChangeStreamPlatform = (id) => {
    setChangeStreamPlatform(true);
    return document.getElementById(`inputStreamPlatform_${id}`).value;
  };

  const handleChangeResourcesPlatform = (id) => {
    setChangeResourcesPlatform(true);
    return document.getElementById(`inputResourcePlatform_${id}`).value;
  };

  const handleChangeSessionChat = (id) => {
    setChangeChatId(true);
    return document.getElementById(`inputSessionChat_${id}`).value;
  };

  const showModal = async () => {
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

    if (
      subject_name !== `${language.chooseSubject}` &&
      name !== "" &&
      streaming !== "" &&
      resource !== "" &&
      chat !== ""
    ) {
      setShowModalSession(true);
      setSessionInfo(info);
    } else {
      let box = document.getElementById("s_dailySession").checked;
      if (box === true) {
        document.getElementById("s_dailySession").checked = false;
      }
      alertCreate();
    }
  };

  useEffect(() => {
    fetchSessions(1);
    fetchSubjects();
  }, []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getSessionFields(language),
      selectedField: getSessionFields(language)[0][0],
      extras: [["", ""]],
    });
  }, [language]);

  return (
    <>
      <div className="schedulesesionslist-main-container" id="scroll">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{language.name}</th>
              <th>{language.streaming}</th>
              <th>{language.resources}</th>
              <th>{language.chatLink}</th>
              <th>{language.subjects}</th>
              <th>{language.repeated}</th>
              <th>{language.startDate}</th>
              <th>{language.endDate}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <button onClick={AddNewSession}>
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
              </th>
              <th>
                <Input
                  id="s_name"
                  type="text"
                  placeholder={language.name}
                  autoComplete="off"
                />
              </th>
              <th>
                <Input id="s_streaming" type="text" placeholder="Streaming" />
              </th>
              <th>
                <Input
                  id="s_resources"
                  type="text"
                  placeholder={language.resources}
                  autoComplete="off"
                />
              </th>
              <th>
                <Input
                  id="s_chatGroup"
                  type="text"
                  placeholder={language.chatLink}
                  autoComplete="off"
                />
              </th>
              <th className="subjecButton">
                <select id="s_subjectId">
                  <option defaultValue={language.chooseSubject}>
                    {language.chooseSubject}
                  </option>
                  {subject.map((s) => (
                    <option key={s.id} value={`${s.subject_code}_${s.id}`}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                <input
                  id="s_dailySession"
                  type="checkbox"
                  onClick={showModal}
                />
              </th>
              <th>
                <Input
                  id="s_start_date"
                  type="datetime-local"
                  placeholder={language.startDate}
                  autoComplete="off"
                />
              </th>
              <th>
                <Input
                  id="s_end_date"
                  type="datetime-local"
                  placeholder={language.endDate}
                  autoComplete="off"
                />
              </th>
            </tr>
          </tbody>
        </table>
        {sessions && sessions.length !== 0 ? (
          <>
            <div className="notify-users">
              <PageSelect
                onPageChange={async (p) => fetchSessions(p)}
                maxPages={maxPages}
              />
            </div>
            <div className="schedule-table-info">
              <table style={{ marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th>{language.code}</th>
                    <th>{language.name}</th>
                    <th>{language.startDate}</th>
                    <th>{language.endDate}</th>
                    <th>{language.streaming}</th>
                    <th>{language.resources}</th>
                    <th>{language.chatLink}</th>
                    <th>{language.subjects}</th>
                    <th>{language.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => {
                    if (filteredSessions !== null)
                      if (
                        filteredSessions.find((fs) => s.id === fs.id) ===
                        undefined
                      )
                        return <Fragment key={s.id} />;
                    return (
                      <tr key={s.id}>
                        <td>{shortUUID(s.id)}</td>
                        <td>
                          <input
                            id={`inputName_${s.id}`}
                            type="text"
                            disabled
                            value={
                              changeName === false ? s.session_name : newName
                            }
                            onChange={() => handleChangeName(s.id)}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputStartDate_${s.id}`}
                            type="datetime-local"
                            value={
                              changeStartDate === false
                                ? s.session_start_date
                                : newStartDate
                            }
                            disabled
                            onChange={(e) => handleChangeStartDate(e, s.id)}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputEndDate_${s.id}`}
                            type="datetime-local"
                            value={
                              changeEndDate === false
                                ? s.session_end_date
                                : newEndDate
                            }
                            disabled
                            onChange={(e) => handleChangeEndDate(e, s.id)}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputStreamPlatform_${s.id}`}
                            type="text"
                            disabled
                            value={
                              s.streaming_platform === null
                                ? ""
                                : changeStreamPlatform === false
                                ? s.streaming_platform
                                : newStreamPlatform
                            }
                            onChange={() => handleChangeStreamPlatform(s.id)}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputResourcePlatform_${s.id}`}
                            type="text"
                            disabled
                            value={
                              s.resources_platform === null
                                ? ""
                                : changeResourcesPlatform === false
                                ? s.resources_platform
                                : newResourcesPlatform
                            }
                            onChange={() => handleChangeResourcesPlatform(s.id)}
                          />
                        </td>
                        <td>
                          <input
                            id={`inputSessionChat_${s.id}`}
                            type="text"
                            disabled
                            value={
                              s.session_chat_id === null
                                ? ""
                                : changeChatId === false
                                ? s.session_chat_id
                                : newChatId
                            }
                            onChange={() => handleChangeSessionChat(s.id)}
                          />
                        </td>
                        <td>
                          <select id={`inputSubjectID_${s.id}`} disabled>
                            <option
                              defaultValue={s.subject.id}
                              value={
                                s.subject.id + "_" + s.subject.subject_code
                              }
                            >
                              {s.subject.name}
                            </option>
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
                          <ExtraFields table="sessions" id={s.id} />
                          <button
                            style={{ marginRight: "5px" }}
                            onClick={() => confirmDeleteEvent(s)}
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
                            onClick={(e) => showEditOptionSession(e, s)}
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
                            onClick={(e) => editSession(e, s)}
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
                            onClick={(e) => closeEditSession(e, s)}
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
            </div>
          </>
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
          fetchSessions(1);
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
          switchSaveState(false);
        }}
        onCloseAction={() => {
          setPopup(false);
          switchSaveState(false);
          setSelectType(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
