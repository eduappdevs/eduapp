import React from "react";
import axios from "axios";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { CALENDAR } from "../../../config";
import { useState } from "react";
import "./views.css";

export default function CreateView(props) {
  let userInfo = FetchUserInfo(localStorage.userId);
  const [globalValue, setGlobalValue] = useState(true);

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
    var subjectValue = e.target.subject.value;
    var subjectInt = parseInt(subjectValue);
    // var globalCourse = document.getElementById("isGlobalCourse").checked;
    var newEvent = {};
    if (
      titleValue !== "" &&
      startValue !== "" &&
      endValue !== "" &&
      subjectValue !== ""
    ) {
      newEvent = {
        annotation_start_date: startValue,
        annotation_end_date: endValue,
        annotation_title: titleValue,
        annotation_description: descriptionValue,
        isGlobal: globalValue,
        user_id: userInfo.id,
        subject_id: subjectInt,
      };
      console.log(newEvent);
      axios.post(CALENDAR, newEvent).then(window.location.reload()).catch();
    } else {
      alertCreate();
    }
  };

  const isNotGlobal = (e) => {
    e.preventDefault();
    if (document.getElementById("subject_name").value === "1") {
      setGlobalValue(true);
    } else {
      setGlobalValue(false);
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
            <div className="calendar-view-create-subject">
              <h3>Subject</h3>
              <select name="subject" id="subject_name" onChange={isNotGlobal}>
                {props.data.map((subject) => (
                  <option value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            {/* future all course <div className="calendar-view-create-isGlobal">
              <h3>All Course</h3>
              <input
                name="isGlobalCourse"
                id="isGlobalCourse"
                type="checkbox"
              />
            </div> */}
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
      <div className="calendar-view-alert-create-container calendar-view-alert-create-hidden">
        <div className="calendar-view-alert-create">
          <h3>No has introducido los valores correactamente.</h3>
        </div>
      </div>
    </div>
  );
}
