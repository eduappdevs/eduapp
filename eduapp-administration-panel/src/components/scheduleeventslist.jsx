/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState } from "react";
import * as API from "../API";
import * as SUBJECTSERVICE from "../services/subject.service";
import * as SCHEDULESERVICE from "../services/schedule.service";
import * as USER_SERVICE from "../services/user.service";
import Input from "./Input";
import { interceptExpiredToken } from "../utils/OfflineManager";
import StandardModal from "./modals/standard-modal/StandardModal";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { LanguageCtx } from "../hooks/LanguageContext";
import PageSelect from "./pagination/PageSelect";
import useFilter from "../hooks/useFilter";
import { getEventFields } from "../constants/search_fields";
import "../styles/scheduleeventslist.css";

export default function Scheduleeventslist() {
  const [language] = useContext(LanguageCtx);

  const [subject, setSubject] = useState([]);
  const [hasDoneInitialFetch, setInitialFetch] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [isPop, setIsPop] = useState(false);

  const [maxPages, setMaxPages] = useState(1);

  const [newStartDate] = useState();
  const [newEndDate] = useState();
  const [newName] = useState();
  const [newDescription] = useState();
  const [newIsPop] = useState();

  const [changeEndDate, setChangeEndDate] = useState(false);
  const [changeStartDate, setChangeStartDate] = useState(false);
  const [changeName, setChangeName] = useState(false);
  const [changeDescription, setChangeDescription] = useState(false);
  const [changeIsPop, setChangeIsPop] = useState(false);
  const [subjectEdit, setSubjectEdit] = useState([]);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [idDelete, setIdDelete] = useState();

  const [searchParams, setSearchParams] = useContext(SearchBarCtx);
  const filteredEvents = useFilter(
    events,
    null,
    SCHEDULESERVICE.filterEvents,
    getEventFields(language)
  );

  const shortUUID = (uuid) => uuid.substring(0, 8);

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

  const connectionAlert = () => {
    switchEditState(false);
    setPopup(true);
    setPopupText(language.connectionAlert);
    setPopupIcon("error");
  };

  const fetchSubjects = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubject()
        .then((res) => {
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

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USER_SERVICE.fetchUserInfos().then((res) => {
        setUsers(res.data);
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const fetchEvents = async (page, order = null) => {
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.pagedEvents(page, order).then((event) => {
        setMaxPages(event.data.total_pages);
        setEvents(event.data.current_page);
        fetchSubjects();
        fetchUsers();
      });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const listSubject = (sub) => {
    let list_subject = [];
    subject.map((s) => {
      if (s.id !== sub.split("_")[0]) {
        list_subject.push(s);
      }
      return true;
    });
    setSubjectEdit(list_subject);
  };

  const alertCreate = async () => {
    switchEditState(false);
    setPopupText(language.creationAlert);
    setPopupType("error");
    setPopup(true);
  };

  const AddNewEvent = async (e) => {
    e.preventDefault();
    switchEditState(false);

    const context = [
      "annotation_title",
      "annotation_description",
      "annotation_start_date",
      "annotation_end_date",
      "isGlobal",
      "isPop",
      "user_id",
      "subject_id",
    ];

    let json = [];
    let name = document.getElementById("e_title").value;
    let author = document.getElementById("e_author").value;
    let description = document.getElementById("e_description").value;
    let start_date = document.getElementById("e_start_date").value;
    let end_date = document.getElementById("e_end_date").value;
    let subject = !isGlobal
      ? document.getElementById("e_subjectId").value
      : (await SUBJECTSERVICE.getGeneralSubject()).data[0].id;
    if (
      name !== "" &&
      author !== "" &&
      start_date !== "" &&
      end_date !== "" &&
      subject !== language.chooseSubject
    ) {
      json.push(
        name,
        description,
        start_date,
        end_date,
        isGlobal,
        isPop,
        author,
        subject
      );
    } else {
      alertCreate();
      return;
    }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = json[i];
    }

    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.createEvent(eventJson)
        .then((e) => {
          if (e) {
            let user = localStorage
              .getItem("offline_user")
              .split("user_id")[1]
              .split('":"')[1]
              .split('"')[0];
            USER_SERVICE.global_events(user).then((x) => {
              if (x) {
                setPopup(true);
                setPopupType("info");
                setPopupText(language.creationCompleted);
                fetchEvents(1);
              }
            });
          }
        })
        .catch(async (e) => {
          if (e) {
            console.log(e);
            await interceptExpiredToken(e);
            setPopupText(language.creationFailed);
            setPopupIcon("error");
            setPopup(true);
          }
        });
    }).then(async (e) => {
      if (e) {
        await interceptExpiredToken(e);
        connectionAlert();
      }
    });
  };

  const isGlobalEvent = () => {
    let checkbox = document.getElementById("e_isGlobal").checked;
    setIsGlobal(checkbox);
  };

  const isPopEvent = () => {
    let checkbox = document.getElementById("e_isPop").checked;
    setIsPop(checkbox);
  };

  const confirmDeleteEvent = async (e) => {
    switchEditState(false);
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText(language.deleteAlert);
    setIsConfirmDelete(true);
    setPopup(true);
    setIdDelete(e);
  };

  const showDeleteError = () => {
    switchEditState(false);
    setPopupType("error");
    popupIcon(false);
    setPopup(false);
    setPopupText(language.deleteFailed);
    setIsConfirmDelete(false);
  };

  const deleteEvent = async (e) => {
    switchEditState(false);
    API.asynchronizeRequest(function () {
      if (e.isGlobal && e.isPop) {
        let user = localStorage
          .getItem("offline_user")
          .split("user_id")[1]
          .split('":"')[1]
          .split('"')[0];
        USER_SERVICE.remove_global_events(user, e.id)
          .then((x) => {
            if (x) {
              SCHEDULESERVICE.deleteEvent(e.id).then((f) => {
                if (f) {
                  setPopup(true);
                  setPopupType("info");
                  setPopupText(language.deleteAlertCompleted);
                  setIsConfirmDelete(false);
                  fetchEvents(1);
                }
              });
            }
          })
          .catch(async (error) => {
            await interceptExpiredToken(error);
            showDeleteError();
          });
      } else {
        SCHEDULESERVICE.deleteEvent(e.id)
          .then((x) => {
            if (x) {
              setPopup(true);
              setPopupType("info");
              setPopupText(language.deleteAlertCompleted);
              setIsConfirmDelete(false);
              fetchEvents(1);
            }
          })
          .catch(async (error) => {
            await interceptExpiredToken(error);
            showDeleteError();
          });
      }
    }).then(async (error) => {
      if (error) {
        await interceptExpiredToken(error);
        connectionAlert();
      }
    });
  };
  const editEvent = (e, s) => {
    switchEditState(false);
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      let isPop =
        e.target.parentNode.parentNode.parentNode.childNodes[8].childNodes[0];

      let inputName = document.getElementById("inputName_" + s.id).value;
      let inputStartDate = document.getElementById(
        "inputStartDate_" + s.id
      ).value;
      let inputEndDate = document.getElementById("inputEndDate_" + s.id).value;
      let inputDescription = document.getElementById(
        "inputDescription_" + s.id
      ).value;

      let editTitle,
        editStartDate,
        editEndDate,
        editDescription,
        editSubject,
        editIsGlobal,
        editIsPop;

      if (inputName !== "" && inputName !== s.annotation_title) {
        editTitle = inputName;
      } else {
        editTitle = s.annotation_title;
      }

      if (inputStartDate !== "" && inputStartDate !== s.annotation_start_date) {
        editStartDate = inputStartDate;
      } else {
        editStartDate = s.annotation_start_date;
      }

      if (inputEndDate !== "" && inputEndDate !== s.annotation_end_date) {
        editEndDate = inputEndDate;
      } else {
        editEndDate = s.annotation_end_date;
      }

      if (
        inputDescription !== "" &&
        inputDescription !== s.annotation_description
      ) {
        editDescription = inputDescription;
      } else {
        editDescription = s.annotation_description;
      }

      if (subject !== undefined && subject !== null) {
        let inputSubject = document.getElementById(
          "inputSubjectID_" + s.id
        ).value;

        if (inputSubject !== "" && inputSubject !== s.subject_id) {
          editSubject = inputSubject.split("_")[0];
        } else {
          editSubject = s.subject_id;
        }
        let inputPop = document.getElementById("inputIsPop_" + s.id).checked;

        if (inputSubject.split("_")[1] !== "General") {
          editIsGlobal = false;
          editIsPop = inputPop;
        } else {
          editIsGlobal = true;
          editIsPop = false;
        }
      }

      API.asynchronizeRequest(function () {
        SCHEDULESERVICE.editEvent({
          id: s.id,
          annotation_start_date: editStartDate,
          annotation_end_date: editEndDate,
          annotation_title: editTitle,
          annotation_description: editDescription,
          isGlobal: editIsGlobal,
          isPop: editIsPop,
          user_id: s.user_id,
          subject_id: editSubject,
        })
          .then((c) => {
            if (c) {
              fetchEvents(1);
              fetchSubjects();
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
              description.disabled = true;
              if (subject !== undefined && subject !== null) {
                subject.disabled = true;
              }
              isPop.disabled = true;
              setIsConfirmDelete(false);
              setPopup(true);
              setPopupType("info");
              setPopupText(language.editAlertCompleted);
            }
          })
          .catch(async (error) => {
            if (error) {
              await interceptExpiredToken(e);
              setPopupText(language.editAlertFailed);
              setPopupIcon("error");
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).catch(async (error) => {
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
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[5]
            .childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[7]
            .childNodes[0];
        let isPop =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[8]
            .childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputStartDate = document.getElementById(
          "inputStartDate_" + s.id
        ).value;
        let inputEndDate = document.getElementById(
          "inputEndDate_" + s.id
        ).value;
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;

        let editTitle,
          editStartDate,
          editEndDate,
          editDescription,
          editSubject,
          editIsGlobal,
          editIsPop;

        if (inputName !== "" && inputName !== s.annotation_title) {
          editTitle = inputName;
        } else {
          editTitle = s.annotation_title;
        }

        if (
          inputStartDate !== "" &&
          inputStartDate !== s.annotation_start_date
        ) {
          editStartDate = inputStartDate;
        } else {
          editStartDate = s.annotation_start_date;
        }

        if (inputEndDate !== "" && inputEndDate !== s.annotation_end_date) {
          editEndDate = inputEndDate;
        } else {
          editEndDate = s.annotation_end_date;
        }

        if (
          inputDescription !== "" &&
          inputDescription !== s.annotation_description
        ) {
          editDescription = inputDescription;
        } else {
          editDescription = s.annotation_description;
        }

        if (subject !== undefined && subject !== null) {
          let inputSubject = document.getElementById(
            "inputSubjectID_" + s.id
          ).value;

          if (inputSubject !== s.subject_id) {
            editSubject = inputSubject.split("_")[0];
          } else {
            editSubject = s.subject_id;
          }

          let inputPop = document.getElementById("inputIsPop_" + s.id).checked;

          if (inputSubject.split("_")[1] !== "General") {
            editIsGlobal = false;
            editIsPop = inputPop;
          } else {
            editIsGlobal = true;
            editIsPop = false;
          }
        }

        API.asynchronizeRequest(function () {
          SCHEDULESERVICE.editEvent({
            id: s.id,
            annotation_start_date: editStartDate,
            annotation_end_date: editEndDate,
            annotation_title: editTitle,
            annotation_description: editDescription,
            isGlobal: editIsGlobal,
            isPop: editIsPop,
            user_id: s.user_id,
            subject_id: editSubject,
          })
            .then((c) => {
              if (c) {
                fetchEvents(1);
                fetchSubjects();

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
                description.disabled = true;
                isPop.disabled = true;
                if (subject !== undefined && subject !== null) {
                  subject.disabled = true;
                }
                setIsConfirmDelete(false);
                setPopup(true);
                setPopupType("info");
                setPopupText(language.editAlertCompleted);
              }
            })
            .catch(async (error) => {
              if (error) {
                await interceptExpiredToken(error);
                setPopupText(language.editAlertFailed);
                setPopupIcon("error");
                setPopup(true);
              }
            });
        }).catch(async (error) => {
          if (error) {
            await interceptExpiredToken(error);
            connectionAlert();
          }
        });
      } else {
        let name = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];
        let isPop = e.target.parentNode.parentNode.childNodes[7].childNodes[0];

        let inputName = document.getElementById("inputName_" + s.id).value;
        let inputStartDate = document.getElementById(
          "inputStartDate_" + s.id
        ).value;
        let inputEndDate = document.getElementById(
          "inputEndDate_" + s.id
        ).value;
        let inputDescription = document.getElementById(
          "inputDescription_" + s.id
        ).value;

        let editTitle,
          editStartDate,
          editEndDate,
          editDescription,
          editSubject,
          editIsGlobal,
          editIsPop;

        if (inputName !== "" && inputName !== s.annotation_title) {
          editTitle = inputName;
        } else {
          editTitle = s.annotation_title;
        }

        if (
          inputStartDate !== "" &&
          inputStartDate !== s.annotation_start_date
        ) {
          editStartDate = inputStartDate;
        } else {
          editStartDate = s.annotation_start_date;
        }

        if (inputEndDate !== "" && inputEndDate !== s.annotation_end_date) {
          editEndDate = inputEndDate;
        } else {
          editEndDate = s.annotation_end_date;
        }

        if (
          inputDescription !== "" &&
          inputDescription !== s.annotation_description
        ) {
          editDescription = inputDescription;
        } else {
          editDescription = s.annotation_description;
        }

        if (subject !== undefined && subject !== null) {
          let inputSubject = document
            .getElementById("inputSubjectID_" + s.id)
            .value.split("_")[0];

          if (inputSubject !== s.subject_id) {
            editSubject = inputSubject;
          } else {
            editSubject = s.subject_id;
          }

          let inputPop = document.getElementById("inputIsPop_" + s.id).checked;

          if (inputSubject.split("_")[1] !== "General") {
            editIsGlobal = false;
            console.log(newIsPop);
            editIsPop = inputPop;
          } else {
            editIsGlobal = true;
            editIsPop = false;
          }
        }

        API.asynchronizeRequest(function () {
          SCHEDULESERVICE.editEvent({
            id: s.id,
            annotation_start_date: editStartDate,
            annotation_end_date: editEndDate,
            annotation_title: editTitle,
            annotation_description: editDescription,
            isGlobal: editIsGlobal,
            isPop: editIsPop,
            user_id: s.user_id,
            subject_id: editSubject,
          })
            .then((c) => {
              if (c) {
                setIsConfirmDelete(false);
                setPopup(true);
                setPopupType("info");
                setPopupText(language.editAlertCompleted);
                fetchEvents(1);
                fetchSubjects();
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
                description.disabled = true;
                isPop.disabled = true;
                if (subject !== undefined && subject !== null) {
                  subject.disabled = true;
                }
              }
            })
            .catch(async (error) => {
              if (error) {
                await interceptExpiredToken(error);
                console.log(error);
                setIsConfirmDelete(false);
                setPopupText(language.editAlertFailed);
                setPopupIcon("error");
                setPopup(true);
              }
            });
        }).catch(async (error) => {
          if (error) {
            await interceptExpiredToken(e);
            connectionAlert();
          }
        });
      }
    }
  };

  const closeEditEvent = (e, s) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];
      let isPop =
        e.target.parentNode.parentNode.parentNode.childNodes[8].childNodes[0];

      if (subject !== undefined) {
        let content = document.getElementById(`inputSubjectID_${s.id}`).value;
        if (s.subject_id !== content.value) {
          content = s.subject_id;
        }
        subject.disabled = true;
      }
      name.disabled = true;
      startDate.disabled = true;
      endDate.disabled = true;
      description.disabled = true;
      isPop.disabled = true;
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
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[7].childNodes[0];
        let isPop =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .childNodes[0].childNodes[8].childNodes[0];

        if (subject !== undefined) {
          let content = document.getElementById(`inputSubjectID_${s.id}`).value;
          if (s.subject_id !== content.value) {
            content = s.subject_id;
          }
          subject.disabled = true;
        }

        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        description.disabled = true;
        isPop.disabled = true;
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
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];
        let isPop = e.target.parentNode.parentNode.childNodes[8].childNodes[0];
        if (subject !== undefined) {
          let content = document.getElementById(`inputSubjectID_${s.id}`).value;
          if (s.subject_id !== content.value) {
            content = s.subject_id;
          }
          subject.disabled = true;
        }
        name.disabled = true;
        startDate.disabled = true;
        endDate.disabled = true;
        description.disabled = true;
        isPop.disabled = true;
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

  const showEditOptionEvent = (e) => {
    if (e.target.tagName === "svg") {
      let name =
        e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
      let description =
        e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
      let startDate =
        e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0];
      let endDate =
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[0];
      let subject =
        e.target.parentNode.parentNode.parentNode.childNodes[7].childNodes[0];

      if (subject !== undefined) {
        subject.disabled = false;
        listSubject(subject.value);
        if (subject.value.split("_")[1] === "GEN") {
          let isPop =
            e.target.parentNode.parentNode.parentNode.childNodes[8]
              .childNodes[0];
          isPop.disabled = false;
        }
      }

      name.disabled = false;
      startDate.disabled = false;
      endDate.disabled = false;
      description.disabled = false;

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
        let description =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[2]
            .childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[4]
            .childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[5]
            .childNodes[0];
        let subject =
          e.target.parentNode.parentNode.parentNode.parentNode.childNodes[7]
            .childNodes[0];

        if (subject !== undefined) {
          subject.disabled = false;
          listSubject(subject.value);
          if (subject.value.split("_")[1] === "GEN") {
            let isPop =
              e.target.parentNode.parentNode.parentNode.parentNode.childNodes[8]
                .childNodes[0];
            isPop.disabled = false;
          }
        }
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        description.disabled = false;

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
        let description =
          e.target.parentNode.parentNode.childNodes[2].childNodes[0];
        let startDate =
          e.target.parentNode.parentNode.childNodes[4].childNodes[0];
        let endDate =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0];
        let subject =
          e.target.parentNode.parentNode.childNodes[7].childNodes[0];

        if (subject !== undefined) {
          subject.disabled = false;
          listSubject(subject.value);
          if (subject.value.split("_")[1] === "GEN") {
            let isPop =
              e.target.parentNode.parentNode.childNodes[8].childNodes[0];
            isPop.disabled = false;
          }
        }
        name.disabled = false;
        startDate.disabled = false;
        endDate.disabled = false;
        description.disabled = false;

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

  const handleChangeName = (id) => {
    setChangeName(true);
    return document.getElementById(`inputName_${id}`).value;
  };

  const handleChangeEndDate = (id) => {
    let content = document.getElementById("inputEndDate_" + id);
    setChangeEndDate(true);
    return content.value;
  };

  const handleChangeStartDate = (id) => {
    let content = document.getElementById("inputStartDate_" + id);
    setChangeStartDate(true);
    return content.value;
  };

  const handleChangeDescription = (id) => {
    setChangeDescription(true);
    return document.getElementById(`inputDescription_${id}`);
  };

  const handleChangeIsPop = (id, value) => {
    setChangeIsPop(true);
    return (document.getElementById(`inputIsPop_${id}`).checked = value);
  };

  useEffect(() => {
    fetchSubjects();
    fetchEvents(1);
    fetchUsers();
    setInitialFetch(true);
  }, []);

  useEffect(() => {
    setSearchParams({
      query: "",
      fields: getEventFields(language),
      selectedField: getEventFields(language)[0][0],
      extras: [["", ""]],
      order: "asc",
    });
  }, [language]);

  useEffect(() => {
    if (hasDoneInitialFetch) {
      fetchEvents(1, {
        field: searchParams.selectedField,
        order: searchParams.order,
      });
    }
  }, [searchParams.order]);

  return (
    <>
      <div className="scheduleeventslist-main-container" id="scroll">
        <table className="createTable">
          <thead>
            <tr>
              <th></th>
              <th>{language.title}</th>
              <th>{language.author}</th>
              <th>{language.description}</th>
              <th>{language.startDate}</th>
              <th>{language.endDate}</th>
              <th>{language.isGlobal}</th>
              {isGlobal ? (
                <th>{language.isPop}</th>
              ) : (
                <th>{language.subjects}</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button onClick={AddNewEvent}>
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
                <Input
                  id="e_title"
                  type="text"
                  placeholder="Title"
                  className={"e_title"}
                />
              </td>
              <td>
                <select id="e_author">
                  <option defaultValue="--">{language.chooseAuthor}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.user.id}>
                      {u.user.email}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <Input
                  id="e_description"
                  type="text"
                  placeholder="Description"
                  className={"e_description"}
                />
              </td>
              <td>
                <input
                  id="e_start_date"
                  type="datetime-local"
                  placeholder="Date"
                />
              </td>
              <td>
                <input
                  id="e_end_date"
                  type="datetime-local"
                  placeholder="Date"
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  id="e_isGlobal"
                  type="checkbox"
                  onClick={isGlobalEvent}
                />
              </td>
              {isGlobal ? (
                <td style={{ textAlign: "center" }}>
                  <input id="e_isPop" type="checkbox" onClick={isPopEvent} />
                </td>
              ) : (
                <td className="subjecButton">
                  <select id="e_subjectId">
                    <option defaultValue="Choose subject">
                      {language.chooseSubject}
                    </option>
                    {subject.map((s) => {
                      if (s.name !== "General") {
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </select>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {events && events.length !== 0 ? (
        <>
          <div className="notify-users">
            <PageSelect
              onPageChange={async (p) => fetchEvents(p)}
              maxPages={maxPages}
            />
          </div>
          <div className="schedule-table-info">
            <table className="eventList" style={{ marginTop: "15px" }}>
              <thead>
                <tr>
                  <th>{language.code}</th>
                  <th>{language.title}</th>
                  <th>{language.description}</th>
                  <th>{language.author}</th>
                  <th>{language.startDate}</th>
                  <th>{language.endDate}</th>
                  <th>{language.isGlobal}</th>
                  <th>{language.subjects}</th>
                  <th>{language.isPop}</th>
                  <th>{language.actions}</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => {
                  if (filteredEvents !== null)
                    if (
                      filteredEvents.find((fe) => e.id === fe.id) === undefined
                    )
                      return <Fragment key={e.id} />;
                  return (
                    <tr key={e.id}>
                      <td>{shortUUID(e.id)}</td>
                      <td>
                        <input
                          type="text"
                          id={`inputName_${e.id}`}
                          disabled
                          value={
                            changeName === false ? e.annotation_title : newName
                          }
                          onChange={() => {
                            handleChangeName(e.id);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={
                            changeDescription === false
                              ? e.annotation_description
                              : newDescription
                          }
                          disabled
                          id={`inputDescription_${e.id}`}
                          onChange={() => {
                            handleChangeDescription();
                          }}
                        />
                      </td>
                      <td>
                        <input type="text" value={e.user.email} disabled />
                      </td>
                      <td>
                        <input
                          id={`inputStartDate_${e.id}`}
                          type="datetime-local"
                          value={
                            changeStartDate === false
                              ? e.annotation_start_date
                              : newStartDate
                          }
                          disabled
                          onChange={() => {
                            handleChangeStartDate(e.id);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          id={`inputEndDate_${e.id}`}
                          type="datetime-local"
                          value={
                            changeEndDate === false
                              ? e.annotation_end_date
                              : newEndDate
                          }
                          disabled
                          onChange={() => {
                            handleChangeEndDate(e.id);
                          }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {e.isGlobal ? (
                          <input type="checkbox" disabled checked />
                        ) : (
                          <input type="checkbox" disabled />
                        )}
                      </td>
                      <td>
                        <select id={`inputSubjectID_${e.id}`} disabled>
                          <option
                            defaultValue={e.subject.id}
                            value={e.subject.id + "_" + e.subject.subject_code}
                          >
                            {e.subject.name}
                          </option>
                          {subjectEdit.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          id={`inputIsPop_${e.id}`}
                          type="checkbox"
                          disabled
                          checked={changeIsPop === false ? e.isPop : newIsPop}
                          onChange={(ev) => {
                            handleChangeIsPop(e.id, ev.target.checked);
                          }}
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
                            confirmDeleteEvent(e);
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
                          onClick={(event) => {
                            showEditOptionEvent(event, e);
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
                          onClick={(event) => {
                            editEvent(event, e);
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
                          onClick={(ev) => {
                            closeEditEvent(ev, e);
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
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          setPopup(false);
          deleteEvent(idDelete);
          setIsConfirmDelete(false);
        }}
        onNoAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchEditState(true);
          switchSaveState(false);
        }}
        onCloseAction={() => {
          setPopup(false);
          setIsConfirmDelete(false);
          switchSaveState(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
