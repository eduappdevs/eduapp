import { React, useState } from "react";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { asynchronizeRequest } from "../../../API";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import { getOfflineUser } from "../../../utils/OfflineManager";
import * as SCHEDULE_SERVICE from "../../../services/schedule.service";
import useRole from "../../../hooks/useRole";
import "./views.css";
import useLanguage from "../../../hooks/useLanguage";

export default function CreateView(props) {
  const [globalValue, setGlobalValue] = useState(true);

  const [saveText, setSaveText] = useState("Save");
  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");

  let userInfo = FetchUserInfo(getOfflineUser().user.id);
  let isTeacher = useRole(userInfo, "eduapp-teacher");
  let isAdmin = useRole(userInfo, "eduapp-admin");

  const language = useLanguage();

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

  const switchSaveState = (state) => {
    if (state) {
      setSaveText("");
      document
        .getElementById("commit-loader-2")
        .classList.remove("commit-loader-hide");
    } else {
      setSaveText(language.save);
      document
        .getElementById("commit-loader-2")
        .classList.add("commit-loader-hide");
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    switchSaveState(true);

    let subjectInfo = document.getElementById("subject_name").value;
    var titleValue = document.getElementById("newTitle").value;
    var descriptionValue = document.getElementById("newDescription").value;
    var startValue = startDate;
    var endValue = endDate;
    var subjectValue = subjectInfo.split("_")[0];
    var subjectInt = subjectValue;
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
        user_id: userInfo.user.id,
        subject_id: subjectInt,
      };
      asynchronizeRequest(async () => {
        await SCHEDULE_SERVICE.createEvent(newEvent);
        window.location.reload();
      }).then((err) => {
        if (err) {
          setPopupText(language.calendar_publish_error);
          setPopupIcon("error");
          switchSaveState(false);
          setPopup(true);
        }
      });
    } else {
      alertCreate();
      switchSaveState(false);
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 500);
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
    setPopupText(language.missing_info);
    setPopupIcon("warning");
    setPopup(true);
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
              <h3>{language.title}</h3>
              <input id="newTitle" name="title" type="text"></input>
            </div>
            <div className="calendar-view-create-hour">
              <h3>{language.date}</h3>
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
              <h3>{language.description}</h3>
              <textarea
                id="newDescription"
                name="description"
                type="text"
                maxLength="150"
              />
            </div>
            <div className="calendar-view-create-subject">
              <h3>{language.subject}</h3>
              <select name="subject" id="subject_name" onChange={isNotGlobal}>
                <option defaultValue={"--"}>
                  {language.calendar_choose_subject}
                </option>
                {props.data.map((subject) => {
                  if (userInfo.teaching_list !== undefined) {
                    if (
                      (isTeacher &&
                        userInfo.teaching_list.includes(subject.id)) ||
                      isAdmin
                    ) {
                      return (
                        <option
                          key={subject.id}
                          value={`${subject.id}_${subject.name}`}
                        >
                          {subject.name}
                        </option>
                      );
                    }
                    return null;
                  }
                  return null;
                })}
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
            <button type="submit">
              {saveText}
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
          </form>
        </div>
      </div>
      <StandardModal
        show={showPopup}
        type={popupIcon}
        text={popupText}
        onCloseAction={() => {
          setPopup(false);
        }}
        hasTransition
        hasIconAnimation
      />
    </div>
  );
}
