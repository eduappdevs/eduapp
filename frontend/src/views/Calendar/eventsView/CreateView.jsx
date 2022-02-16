import React from "react";
import "./views.css";
import axios from "axios";

export default function CreateView() {
  const closeButton = async () => {
    const chatBox = document.getElementById("create-box");
    chatBox.style.display = "flex";

    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];

    chatBox.classList.remove("create-box-opened");
    chatBox.classList.add("create-box-closed");

    const calendarMainScroll = document.getElementsByClassName(
      "calendar-main-container"
    )[0];

    calendarMainScroll.classList.remove("disable-scroll");

    setTimeout(() => {
      backgroundCalendar.style.display = "none";
    }, 150);
  };

  const createEvent = async (e) => {
    e.preventDefault();
    var titleValue = document.getElementById("newTitle").value;
    var descriptionValue = document.getElementById("newDescription").value;
    var startValue = document.getElementById("newStartDate").value;
    var endValue = document.getElementById("newEndDate").value;
    var newEvent = {};
    console.log(typeof endValue);
    if (
      titleValue !== "" &&
      descriptionValue !== "" &&
      startValue !== "" &&
      endValue !== ""
    ) {
      newEvent = {
        annotation_start_date: startValue,
        annotation_end_date: endValue,
        annotation_title: titleValue,
        annotation_description: descriptionValue,
        isGlobal: true,
        user_id: 1,
      };
      axios
        .post("http://localhost:3000/calendar_annotations/", newEvent)
        .then(window.location.reload())
        .catch(console.log("error"));
    } else {
      console.log(newEvent)
      alertCreate();
    }
  };

  const alertCreate = async () => {
    document
      .getElementsByClassName("calendar-view-alert-create-container")[0]
      .classList.remove("calendar-view-alert-create-hidden");
    setTimeout(() => {
      document
        .getElementsByClassName("calendar-view-alert-create-container")[0]
        .classList.add("calendar-view-alert-create-hidden");
    }, 2000);
  };

  return (
    <div
      id="create-box"
      className="calendar-view-create-main-container calendar-view-create-hidden"
    >
      <div className="calendar-view-create">
        <div className="calendar-view-create-header">
          <div
            className="calendar-view-create-header-close-button"
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
        <div className="calendar-view-create-contents">
          <form action="submit" onSubmit={createEvent}>
            <div className="calendar-view-create-title">
              <h3>Title</h3>
              <input id="newTitle" name="title" type="text"></input>
            </div>
            <div className="calendar-view-create-hour">
              <h3>Date</h3>
              <div className="calendar-view-create-hour-input">
                <input id="newStartDate" name="start" type="datetime-local" />
                <input id="newEndDate" name="end" type="datetime-local" />
              </div>
            </div>
            <div className="calendar-view-create-description">
              <h3>Description</h3>
              <textarea
                id="newDescription"
                name="description"
                type="text"
                maxlength="150"
              />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
      <div className="calendar-view-alert-create-container calendar-view-alert-create-hidden">
        <div className="calendar-view-alert-create =">
          <h3>No has introducido los valores correactamente.</h3>
        </div>
      </div>
    </div>
  );
}
