import axios from "axios";
import React, { useEffect, useState } from "react";
import "./views.css";
export default function EditView(props) {
  const closeButton = async () => {
    const chatBox = document.getElementById("edit-box");
    chatBox.style.display = "flex";

    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];

    chatBox.classList.remove("edit-box-opened");
    chatBox.classList.add("edit-box-closed");

    const calendarMainScroll = document.getElementsByClassName(
      "calendar-main-container"
    )[0];

    calendarMainScroll.classList.remove("disable-scroll");

    setTimeout(() => {
      backgroundCalendar.style.display = "none";
    }, 150);
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    var titleValue = document.getElementById("editTitle").value;
    var descriptionValue = document.getElementById("editDescription").value;
    var startValue = document.getElementById("editStartDate").value;
    var endValue = document.getElementById("editEndDate").value;
    var editTitle;
    var editDescription;
    var editStartDate;
    var editEndDate;
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
    var editEvent = {
      annotation_start_date: editStartDate,
      annotation_end_date: editEndDate,
      annotation_title: editTitle,
      annotation_description: editDescription,
      isGlobal: true,
      user_id: 1,
    };
    axios
      .put(
        `http://localhost:3000/calendar_annotations/${props.data.id}`,
        editEvent
      )
      .then(window.location.reload())
      .catch();
  };

  const deleteEvent = async () => {
    axios
      .delete(`http://localhost:3000/calendar_annotations/${props.data.id}`)
      .then(window.location.reload())
      .catch();
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
            onClick={deleteEvent}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi bi-trash3"
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
              class="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
              />
              <path
                fill-rule="evenodd"
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
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
