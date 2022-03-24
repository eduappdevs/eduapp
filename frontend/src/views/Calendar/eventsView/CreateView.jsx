import { React, useState } from "react";
import axios from "axios";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { CALENDAR } from "../../../config";
import "./views.css";

export default function CreateView(props) {
  let userInfo = FetchUserInfo(localStorage.userId);
  const [globalValue, setGlobalValue] = useState(true);

  const getDateTimeLocal = () => {
    let now = new Date();
    return `${now.getFullYear()}-${
      now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1
    }-${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}T${
      now.getHours() < 10 ? "0" + now.getHours() : now.getHours()
    }:${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}`;
  };

  const [startDate, setStartDate] = useState(getDateTimeLocal);
  const [endDate, setEndDate] = useState(getDateTimeLocal);

  const closeButton = async () => {
    const calendarBox = document.getElementById("create-box");

    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];
    calendarBox.classList.remove("create-box-opened");
    calendarBox.classList.add("create-box-closed");
    backgroundCalendar.classList.add("background-shadow-animation");
    backgroundCalendar.style.animationDirection = "reverse";

    setTimeout(() => {
      calendarBox.style.opacity = 0;
    }, 550);
    setTimeout(() => {
      document.body.style.overflow = "scroll";
      backgroundCalendar.style.display = "none";
      backgroundCalendar.classList.remove("background-shadow-animation");
    }, 500);
  };

  const createEvent = async (e) => {
    e.preventDefault();
    let subjectInfo = document.getElementById("subject_name").value;
    var titleValue = document.getElementById("newTitle").value;
    var descriptionValue = document.getElementById("newDescription").value;
    var startValue = startDate;
    var endValue = endDate;
    var subjectValue = subjectInfo.split("_")[0];
    var subjectInt = parseInt(subjectValue);
    var isGlobalValue = document.getElementById("subject_name").value;
    // var globalCourse = document.getElementById("isGlobalCourse").checked;
    var newEvent = {};
    if (
      titleValue !== "" &&
      startValue !== "" &&
      endValue !== "" &&
      subjectValue !== "" &&
      isGlobalValue !== null &&
      isGlobalValue !== "Choose subject"
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
      axios
        .post(CALENDAR, newEvent)
        .then(() => {
          window.location.reload();
        })
        .catch();
    } else {
      alertCreate();
    }
  };

  const isNotGlobal = (e) => {
    e.preventDefault();
    let subjectInfo = document.getElementById("subject_name").value;
    if (subjectInfo.split("_")[1] !== "Noticias") {
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
      className="calendar-view-create-main-container create-box-closed"
      style={({ display: "flex" }, { opacity: 0 })}
    >
      <div className="calendar-view-create">
        <div className="calendar-view-create-header">
          <div
            className="calendar-view-create-header-close-button"
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
        <div className="calendar-view-create-contents">
          <form action="submit" onSubmit={createEvent}>
            <div className="calendar-view-create-title">
              <h3>Title</h3>
              <input id="newTitle" name="title" type="text"></input>
            </div>
            <div className="calendar-view-create-hour">
              <h3>Date</h3>
              <div className="calendar-view-create-hour-input">
                <input
                  id="newStartDate"
                  name="start"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
                <input
                  id="newEndDate"
                  name="end"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="calendar-view-create-description">
              <h3>Description</h3>
              <textarea
                id="newDescription"
                name="description"
                type="text"
                maxLength="150"
              />
            </div>
            <div className="calendar-view-create-subject">
              <h3>Subject</h3>
              <select name="subject" id="subject_name" onChange={isNotGlobal}>
                <option defaultValue={"--"}>Choose subject</option>
                {props.data.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id + "_" + subject.name}
                  >
                    {subject.name}
                  </option>
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
          <h3>You have not entered the values ​​correctly.</h3>
        </div>
      </div>
    </div>
  );
}
