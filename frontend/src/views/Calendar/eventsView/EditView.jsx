import axios from "axios";
import React from "react";
import { CALENDAR, EDUAPP_SESSIONS } from "../../../config";
import "./views.css";
import { asynchronizeRequest } from "../../../API";

export default function EditView(props) {
  const closeButton = async () => {
    const editBox = document.getElementById("edit-box");
    editBox.style.display = "flex";
    editBox.classList.remove("edit-box-opened");
    editBox.classList.add("edit-box-closed");

    const calendarMainScroll = document.getElementsByClassName(
      "calendar-main-container"
    )[0];

    calendarMainScroll.classList.remove("disable-scroll");

    setTimeout(() => {
      editBox.classList.add("calendar-view-edit-hidden");
    }, 150);
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    var titleValue = document.getElementById("editTitle").value;
    var descriptionValue = document.getElementById("editDescription").value;
    var startValue = document.getElementById("editStartDate").value;
    var endValue = document.getElementById("editEndDate").value;
    var chatValue = document.getElementById("editChat").value;
    var resourceValue = document.getElementById("editResources").value;
    var streamValue = document.getElementById("editStream").value;
    var editTitle;
    var editDescription;
    var editStartDate;
    var editEndDate;
    var editChat;
    var editResources;
    var editStream;
    var editId;

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
        id: editId,
        annotation_start_date: editStartDate,
        annotation_end_date: editEndDate,
        annotation_title: editTitle,
        annotation_description: editDescription,
        isGlobal: props.data.isGlobal,
        user_id: localStorage.userId,
      };
      asynchronizeRequest(function () {
        axios.put(CALENDAR + "/" + props.data.id, editEvent).then(() => {
          window.location.reload();
        });
      });
    } else {
      var editEventSession = {
        session_name: editTitle,
        session_start_date: editStartDate,
        session_end_date: editEndDate,
        streaming_platform: editStream,
        resources_platform: editResources,
        session_chat_id: editChat,
      };
      asynchronizeRequest(function () {
        axios
          .put(EDUAPP_SESSIONS + "/" + props.data.id, editEventSession)
          .then(() => {
            window.location.reload();
          });
      });
    }
  };

  const confirmDeleteEvent = async () => {
    document
      .getElementsByClassName("calendar-view-edit-alert-delete-container")[0]
      .classList.remove("calendar-view-alert-delete-hidden");
  };

  const deleteEvent = async () => {
    if (props.data.description !== undefined) {
      asynchronizeRequest(function () {
        axios.delete(CALENDAR + "/" + props.data.id).then(() => {
          window.location.reload();
        });
      });
    } else {
      asynchronizeRequest(function () {
        axios.delete(EDUAPP_SESSIONS + "/" + props.data.id).then(() => {
          window.location.reload();
        });
      });
    }
  };

  const closeDeleteWindow = async () => {
    document
      .getElementsByClassName("calendar-view-edit-alert-delete-container")[0]
      .classList.add("calendar-view-alert-delete-hidden");
  };

  return (
    <div
      id="edit-box"
      className="calendar-view-edit-main-container calendar-view-edit-hidden"
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
              <h3>Title</h3>
              <input
                id="editTitle"
                placeholder={props.data.title}
                name="editTitle"
                type="text"
              ></input>
            </div>
            <div className="calendar-view-edit-hour">
              <h3>Hour</h3>
              <div className="calendar-view-edit-hour-input">
                <input
                  id="editStartDate"
                  name="editStartDate"
                  type="datetime-local"
                />
                <input id="editEndDate" name="end" type="datetime-local" />
              </div>
            </div>
            <div className="calendar-view-edit-description">
              <h3>Description</h3>
              <textarea
                id="editDescription"
                placeholder={props.data.description}
                name="editDescription"
                type="text"
                maxlength="150"
              />
            </div>
            <div className="calendar-view-edit-session-information">
              <h3>Resources</h3>
              <input
                placeholder={props.data.resources}
                id="editResources"
                name="editResources"
                type="text"
              />
              <h3>Platform stream</h3>
              <input
                id="editStream"
                placeholder={props.data.stream}
                name="editStream"
                type="text"
              />
              <h3>Session Chat</h3>
              <input
                type="text"
                placeholder={props.data.chat}
                name="editChat"
                id="editChat"
              />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
        <div className="calendar-view-edit-alert-delete-container calendar-view-alert-delete-hidden">
          <div className="calendar-view-edit-alert-delete">
            <h3>¿Deseas eliminar el evento?</h3>
            <div className="buttonsDeleteCalendar">
              <div className="buttonDeleteCalendar" onClick={deleteEvent}>
                Si
              </div>
              <div onClick={closeDeleteWindow}>No</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
