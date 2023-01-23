import React, { useEffect, useState } from "react";
import * as USERSERVICE from "../../../services/user.service";
import * as SUBJECTSERVICE from "../../../services/subject.service";
import { useNavigate } from "react-router-dom";
import { asynchronizeRequest } from "../../../API";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { getOfflineUser } from "../../../utils/OfflineManager";
import EditView from "./EditView";
import useRole from "../../../hooks/useRole";
import useLanguage from "../../../hooks/useLanguage";
import "./views.css";

export default function View(props) {
  const language = useLanguage();
  const navigate = useNavigate();

  const [User, setUser] = useState();
  const [viewAuthor, setViewAuthor] = useState(false);
  const [subject, setSubject] = useState(null);

  let userinfo = FetchUserInfo(getOfflineUser().user.id);
  let isTeacher = useRole(userinfo, "eduapp-teacher");
  let isAdmin = useRole(userinfo, "eduapp-admin");

  const [editEvent, setEditEvent] = useState({});

  const fetchSubject = async () => {
    let subject = await SUBJECTSERVICE.fetchSubject(props.data.subject_id);
    setSubject(subject.data);
  };

  const closeButton = async () => {
    const viewBox = document.getElementById("view-box");
    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];

    viewBox.classList.remove("view-box-opened");
    viewBox.classList.add("view-box-closed");
    backgroundCalendar.classList.add("background-shadow-animation");
    backgroundCalendar.style.animationDirection = "reverse";

    if (props.data.description !== undefined) {
      document
        .getElementsByClassName("calendar-view-session-information")[0]
        .classList.add("description-hidden");
      document
        .getElementsByClassName("calendar-view-edit-session-information")[0]
        .classList.add("description-hidden");
      if (props.data.description === "") {
        document
          .getElementsByClassName("calendar-view-description")[0]
          .classList.add("description-hidden");
        document
          .getElementsByClassName("calendar-view-edit-description")[0]
          .classList.add("description-hidden");
      } else {
        document
          .getElementsByClassName("calendar-view-description")[0]
          .classList.remove("description-hidden");
        document
          .getElementsByClassName("calendar-view-edit-description")[0]
          .classList.remove("description-hidden");
      }
    } else {
      document
        .getElementsByClassName("calendar-view-session-information")[0]
        .classList.remove("description-hidden");
      document
        .getElementsByClassName("calendar-view-edit-session-information")[0]
        .classList.remove("description-hidden");
      document
        .getElementsByClassName("calendar-view-description")[0]
        .classList.add("description-hidden");
      document
        .getElementsByClassName("calendar-view-edit-description")[0]
        .classList.add("description-hidden");
    }

    setTimeout(() => {
      document.body.style.overflow = "scroll";
      viewBox.style.display = "none";
      backgroundCalendar.style.display = "none";
    }, 450);
    setTimeout(() => {
      backgroundCalendar.classList.remove("background-shadow-animation");
    }, 550);
  };

  const openEditMenu = async () => {
    let eventEdit = props.data;
    const editBox = document.getElementById("edit-box");

    setEditEvent(eventEdit);
    setTimeout(() => {
      editBox.style.display = "flex";
    }, 1);

    setTimeout(() => {
      editBox.classList.add("edit-box-opened");
      editBox.classList.remove("edit-box-closed");
    }, 150);
  };

  const getTime = () => {
    if (props.data.startDate !== undefined) {
      let start = props.data.startDate;
      let end = props.data.endDate;
      start = start.split("T")[1].substr(0, start.length - 3);
      end = end.split("T")[1].substr(0, end.length - 3);
      return start + "-" + end;
    }
  };

  const fetchUser = () => {
    asynchronizeRequest(function () {
      USERSERVICE.findById(props.data.user_id).then((u) => {
        setUser(u.data);
        setViewAuthor(true);
      });
    });
  };

  useEffect(() => {
    fetchSubject();
    if (props.data.description !== undefined) {
      document
        .getElementsByClassName("calendar-view-session-information")[0]
        .classList.add("description-hidden");
      document
        .getElementsByClassName("calendar-view-edit-session-information")[0]
        .classList.add("description-hidden");
      if (props.data.description === "") {
        document
          .getElementsByClassName("calendar-view-description")[0]
          .classList.add("description-hidden");
        document
          .getElementsByClassName("calendar-view-edit-description")[0]
          .classList.add("description-hidden");

        fetchUser();
      } else {
        document
          .getElementsByClassName("calendar-view-description")[0]
          .classList.remove("description-hidden");
        document
          .getElementsByClassName("calendar-view-edit-description")[0]
          .classList.remove("description-hidden");
        fetchUser();
      }
    } else {
      document
        .getElementsByClassName("calendar-view-session-information")[0]
        .classList.remove("description-hidden");
      document
        .getElementsByClassName("calendar-view-edit-session-information")[0]
        .classList.remove("description-hidden");
      document
        .getElementsByClassName("calendar-view-description")[0]
        .classList.add("description-hidden");
      document
        .getElementsByClassName("calendar-view-edit-description")[0]
        .classList.add("description-hidden");
    }
  }, [props.data]);

  return (
    <div
      id="view-box"
      className="calendar-view-main-container view-box-closed"
      style={{ display: "none" }}
    >
      <div className="calendar-view">
        <div className="calendar-view-header">
          <div
            className={
              isAdmin ||
              (isTeacher &&
                userinfo.teaching_list.includes(props.data.subject_id))
                ? "calendar-view-header-edit-button"
                : "hidden"
            }
            onClick={openEditMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="bi bi-pencil"
              viewBox="0 0 16 16"
            >
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
            </svg>
          </div>
          <div
            className="calendar-view-header-close-button"
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
        <div className="calendar-view-contents">
          <div className="calendar-view-contents-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={props.data.backgroundColor}
              className="bi bi-circle-fill"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>
            <p>{props.data.title}</p>
          </div>
          <div className="calendar-view-contents-info">
            <div className="calendar-view-hour">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-clock"
                viewBox="0 0 16 16"
              >
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
              <p>{getTime()}</p>
            </div>
            <div className="calendar-view-description">
              <h3>{language.description}</h3>
              <p>{props.data.description}</p>
            </div>
            {viewAuthor === true ? (
              <div className="calendar-view-author">
                <h3>{language.author}</h3>
                {User ? <p>{User[0].user.email}</p> : null}
              </div>
            ) : null}
            {(isAdmin || isTeacher) ? (
              <ul>
                {subject?.users.map(user => (
                  <li key={user.id} className="subject-users">
                    {user.email}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="calendar-view-session-information">
              <h3>{language.links}</h3>
              <div className="calendar-view-session-information-icon">
                <p>
                  <svg
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    className="bi bi-mortarboard"
                    viewBox="0 0 16 16"
                    onClick={() => {
                      props.data.resources &&
                        (window.location = props.data.resources);
                    }}
                  >
                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5ZM8 8.46 1.758 5.965 8 3.052l6.242 2.913L8 8.46Z" />
                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46l-3.892-1.556Z" />
                  </svg>
                </p>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    fill="currentColor"
                    className="bi bi-camera-video"
                    viewBox="0 0 16 16"
                    onClick={() => {
                      props.data.stream &&
                        (window.location = props.data.stream);
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"
                    />
                  </svg>
                </p>
                {subject?.chat_link ? (
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      className="bi bi-chat-dots"
                      viewBox="0 0 16 16"
                      onClick={() => {
                        navigate(`/chat/g${subject?.chat_link}`);
                      }}
                    >
                      <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                    </svg>
                  </p>
                ) : !subject?.chat_link && (isAdmin || isTeacher) ? (
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      className="bi bi-chat-dots"
                      viewBox="0 0 16 16"
                      onClick={() => {
                        navigate(`/chat/create/group/${subject?.id}`);
                      }}
                    >
                      <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                    </svg>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditView data={editEvent} />
    </div>
  );
}
