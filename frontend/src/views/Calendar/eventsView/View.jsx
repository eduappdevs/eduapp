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
import userCan, { SESSION, UPDATE, EVENT,  } from "../../../hooks/userCan";
import "./views.css";
import { ChatIcon, CamaraIcon, MortarboardIcon, ClockIcon, CircleFillIcon } from "../../../components/ui/Icons";

export default function View(props) {
  const language = useLanguage();
  const navigate = useNavigate();

  const [User, setUser] = useState();
  const [viewAuthor, setViewAuthor] = useState(false);
  const [subject, setSubject] = useState(null);

  let userinfo = FetchUserInfo(getOfflineUser().user.id);
  let isTeacher = useRole(userinfo, "eduapp-teacher");
  let isAdmin = useRole(userinfo, "eduapp-admin");
  let isStudent = useRole(userinfo, "eduapp-student");
  let canUpdateEvent = userinfo && userCan(userinfo, EVENT, UPDATE);
  let canUpdateSession = userinfo && userCan(userinfo, SESSION, UPDATE);

  const [editEvent, setEditEvent] = useState({});

  const fetchSubject = async () => {
    if (props.data.subject_id) {
      let subject = await SUBJECTSERVICE.fetchSubject(props.data.subject_id);
      setSubject(subject.data);
    }
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

  // const thisChatHasATeacher = () => {
  //   subject.users.forEach(u => {
  //     if (u.userinfo) {
  //       u.userinfo.teaching_list.forEach(s => {
  //         if (subject.id == s) return true;
  //       })
  //     }
  //   });
  //   return false;
  // }

  const chatLink = () => {
    let chatHasTeacher;
    const isLinkCreated = subject?.chat_link && subject.chat_link !== "-";
    const notLinkCreated = !subject?.chat_link || subject?.chat_link === "-";

    if (isTeacher) {
      chatHasTeacher = subject.users.find(user => user.id === userinfo)
    }
    // const chatHasTeacher = thisChatHasATeacher();

    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 500);

    // if (isLinkCreated && chatHasTeacher) {
    //   navigate(`/chat/g${subject?.chat_link}`)
    // }

    if (notLinkCreated && (isAdmin || isTeacher)) {
      navigate(`/chat/create/group/${subject?.id}`);
    }

    if (!chatHasTeacher && isTeacher) {
      navigate(`/chat/create/group/${subject?.id}`);
    }

    if (isLinkCreated) {
      navigate(`/chat/g${subject?.chat_link}`)
    }
  }

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
                  userinfo.teaching_list.includes(props.data.subject_id) && 
                  ((canUpdateEvent && props.data.description !== undefined) //props.data.description shows whether is session or event
                  // || (canUpdateSession && props.data.description == undefined) //maybe this is necessary if session is enabled for teachers
                  ) 
                  )
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
            <CircleFillIcon fill={props.data.backgroundColor} />
            <p>{props.data.title}</p>
          </div>
          <div className="calendar-view-contents-info">
            <div className="calendar-view-hour">
              <ClockIcon />
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
              <div className="calendar-view-users">
                {subject?.users.map(user => (
                  <p key={user.id} className="subject-users">
                    {user.email}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="calendar-view-session-information">
              <h3>{language.links}</h3>
              <div className="calendar-view-session-information-icon">
                <p>
                  <MortarboardIcon
                    onClick={() => {
                      setTimeout(() => {
                        document.body.style.overflow = "auto";
                      }, 500);
                      props.data.resources &&
                        (window.location = props.data.resources);
                    }}
                  />
                </p>
                <p>
                  <CamaraIcon
                    onClick={() => {
                      setTimeout(() => {
                        document.body.style.overflow = "auto";
                      }, 500);
                      props.data.stream &&
                        (window.location = props.data.stream);
                    }}
                  />
                </p>

                {(subject?.chat_link && subject.chat_link !== "-") ? (
                  <p>
                    <ChatIcon
                      onClick={() => chatLink()} />
                  </p>
                ) : (!subject?.chat_link || subject?.chat_link === "-") && (isAdmin || isTeacher) ? (
                  <p>
                    <ChatIcon
                      onClick={() => chatLink()} />
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
