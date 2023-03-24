import { React, useEffect, useState } from "react";
import { asynchronizeRequest } from "../../../API";
import * as SCHEDULE_SERVICE from "../../../services/schedule.service";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import { getOfflineUser } from "../../../utils/OfflineManager";
import useLanguage from "../../../hooks/useLanguage";
import "./views.css";

export default function EditView(props) {
  const language = useLanguage();

  const [editStartDate, setEditStart] = useState("");
  const [editEndDate, setEditEnd] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saveText, setSaveText] = useState(language.save);

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [hasIconFill, setHasIconFill] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const confirmDeleteEvent = async () => {
    setPopupType("warning");
    setHasIconFill(true);
    setPopupMessage(language.calendar_delete_confirm);
    setIsConfirmDelete(true);
    setShowPopup(true);
  };

  const showDeleteError = () => {
    setShowPopup(false);
    setPopupType("error");
    setHasIconFill(false);
    setShowLoader(false);
    setPopupMessage(language.calendar_delete_unknown);
    setIsConfirmDelete(false);
    setShowPopup(true);
  };

  const showUpdateError = () => {
    setShowPopup(false);
    setPopupType("error");
    setHasIconFill(false);
    setShowLoader(false);
    setPopupMessage(language.calendar_update_unknown);
    setIsConfirmDelete(false);
    setShowPopup(true);
  };

  const switchSaveState = (state) => {
    if (state) {
      setSaveText("");
      document
        .getElementById("commit-loader")
        .classList.remove("commit-loader-hide");
    } else {
      setSaveText(language.save);
      document
        .getElementById("commit-loader")
        .classList.add("commit-loader-hide");
    }
  };

  const closeButton = async () => {
    const editBox = document.getElementById("edit-box");
    setTimeout(() => {
      editBox.classList.remove("edit-box-opened");
      editBox.classList.add("edit-box-closed");
    }, 150);
    setTimeout(() => {
      editBox.style.display = "none";
    }, 500);
  };

  useEffect(() => {
    setEditStart(props.data.startDate);
    setEditEnd(props.data.endDate);
    setEditTitle(props.data.title);
    setEditDescription(props.data.description);
  }, [props.data]);

  const updateEvent = async (e) => {
    e.preventDefault();
    switchSaveState(true);

    var titleValue = document.getElementById("editTitle").value;
    var descriptionValue = document.getElementById("editDescription").value;
    var startValue = document.getElementById("editStartDate").value;
    var endValue = document.getElementById("editEndDate").value;
    var chatValue = document.getElementById("editChat").value;
    var resourceValue = document.getElementById("editResources").value;
    var streamValue = document.getElementById("editStream").value;
    var editTitle,
      editDescription,
      editStartDate,
      editEndDate,
      editChat,
      editResources,
      editStream;

    if (titleValue !== "" && titleValue !== props.data.title) {
      editTitle = titleValue;
    } else {
      editTitle = props.data.title;
    }

    if (
      descriptionValue !== "" &&
      descriptionValue !== props.data.description
    ) {
      editDescription = descriptionValue;
    } else {
      editDescription = props.data.description;
    }

    if (startValue !== "" && startValue !== props.data.start) {
      editStartDate = startValue;
    } else {
      editStartDate = props.data.startDate;
    }

    if (endValue !== "" && endValue !== props.data.end) {
      editEndDate = endValue;
    } else {
      editEndDate = props.data.endDate;
    }

    if (chatValue !== "" && chatValue !== props.data.chat) {
      editChat = chatValue;
    } else {
      editChat = props.data.chat;
    }

    if (resourceValue !== "" && resourceValue !== props.data.resources) {
      editResources = resourceValue;
    } else {
      editResources = props.data.resources;
    }

    if (streamValue !== "" && streamValue !== props.data.stream) {
      editStream = streamValue;
    } else {
      editStream = props.data.stream;
    }

    if (props.data.description !== undefined) {
      var editEvent = {
        id: props.data.id,
        annotation_start_date: editStartDate,
        annotation_end_date: editEndDate,
        annotation_title: editTitle,
        annotation_description: editDescription,
        isGlobal: props.data.isGlobal,
        user_id: getOfflineUser().user.id,
      };
      asynchronizeRequest(async function () {
        await SCHEDULE_SERVICE.editEvent(editEvent);
        window.location.reload();
      }).then((error) => {
        if (error) {
          showUpdateError();
          switchSaveState(false);
        }
      });
    } else {
      var editEventSession = {
        id: props.data.id,
        session_name: editTitle,
        session_start_date: editStartDate,
        session_end_date: editEndDate,
        streaming_platform: editStream,
        resources_platform: editResources,
        session_chat_id: editChat,
      };
      asynchronizeRequest(async function () {
        await SCHEDULE_SERVICE.editSession(editEventSession);
        window.location.reload();
      }).then((error) => {
        if (error) {
          showUpdateError();
          switchSaveState(false);
        }
      });
    }
  };

  const deleteEvent = async () => {
    if (props.data.description !== undefined) {
      asynchronizeRequest(async function () {
        await SCHEDULE_SERVICE.deleteEvent(props.data.id);
        window.location.reload();
      }).then((error) => {
        if (error) showDeleteError();
      });
    } else {
      asynchronizeRequest(async function () {
        await SCHEDULE_SERVICE.deleteSession(props.data.id);
        window.location.reload();
      }).then((error) => {
        if (error) showDeleteError();
      });
    }
  };

  return (
    <div
      id="edit-box"
      className="calendar-view-edit-main-container edit-box-closed"
      style={{ display: "none" }}
    >
      <div className="calendar-view-edit">
        <div className="calendar-view-edit-header">
          <div
            className="calendar-view-edit-header-delete-button"
            onClick={confirmDeleteEvent}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="bi bi-trash3"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
            </svg>
          </div>
          <div
            className="calendar-view-edit-header-close-button"
            onClick={closeButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
          </div>
        </div>
        <div className="calendar-view-edit-contents">
          <form action="submit" onSubmit={updateEvent}>
            <div className="calendar-view-edit-title">
              <h3>{language.title}</h3>
              <input
                id="editTitle"
                placeholder={props.data.title}
                name="editTitle"
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                }}
              ></input>
            </div>
            <div className="calendar-view-edit-hour">
              <h3>{language.date}</h3>
              <div className="calendar-view-edit-hour-input">
                <input
                  id="editStartDate"
                  name="editStartDate"
                  type="datetime-local"
                  value={editStartDate}
                  onChange={(e) => {
                    setEditStart(e.target.value);
                  }}
                />
                <input
                  id="editEndDate"
                  name="end"
                  type="datetime-local"
                  value={editEndDate}
                  onChange={(e) => {
                    setEditEnd(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="calendar-view-edit-description">
              <h3>{language.description}</h3>
              <textarea
                id="editDescription"
                placeholder={props.data.description}
                name="editDescription"
                type="text"
                maxLength="150"
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                }}
              />
            </div>
            <div className="calendar-view-edit-session-information">
              <h3>{language.resources}</h3>
              <input
                placeholder={props.data.resources}
                id="editResources"
                name="editResources"
                type="text"
              />
              <h3>{language.streaming_platform}</h3>
              <input
                id="editStream"
                placeholder={props.data.stream}
                name="editStream"
                type="text"
              />
              <h3>{language.session_chat}</h3>
              <input
                type="text"
                placeholder={props.data.chat}
                name="editChat"
                id="editChat"
              />
            </div>
            <button type="submit">
              {saveText}
              <svg
                id="commit-loader"
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
          </form>
        </div>
        <StandardModal
          show={showPopup}
          iconFill={hasIconFill}
          type={popupType}
          text={popupMessage}
          isQuestion={isConfirmDelete}
          onYesAction={() => {
            setShowLoader(true);
            deleteEvent();
          }}
          onNoAction={() => {
            setShowPopup(false);
          }}
          onCloseAction={() => {
            setShowPopup(false);
          }}
          showLoader={showLoader}
          hasTransition
          hasIconAnimation
        />
      </div>
    </div>
  );
}
