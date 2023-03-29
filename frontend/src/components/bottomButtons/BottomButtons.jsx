import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import { getOfflineUser } from "../../utils/OfflineManager";
import useRole from "../../hooks/useRole";
import "./BottomButtons.css";

/**
 * The bottom navbar of the app for mobile.
 *
 * @param {Boolean} mobile Tests for mobile or desktop display.
 * @param {String} badgeCount Count for unread notifications for chats.
 */
export default function BottomButtons({ mobile, badgeCount }) {
  const [inHome, setInHome] = useState(false);
  const [inResources, setInResources] = useState(false);
  const [inCalendar, setInCalendar] = useState(false);
  const [inManagement, setInManagement] = useState(false);
  const [inChat, setInChat] = useState(false);
  const loc = useLocation();

  let userInfo = FetchUserInfo(getOfflineUser().user.id);
  let isAdmin = useRole(userInfo, "eduapp-admin");

  const getPosition = (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
  };

  const changeLocation = () => {
    if (loc.pathname.substring(1) === "login")
      document.getElementById("bottom-navigator").style.display = "none";
    else document.getElementById("bottom-navigator").style.display = "block";

    switch (loc.pathname.substring(1)) {
      case "resources":
        setInResources(true);
        setInCalendar(false);
        setInChat(false);
        setInHome(false);
        setInManagement(false);
        break;
      case "home":
        setInResources(false);
        setInCalendar(false);
        setInChat(false);
        setInHome(true);
        setInManagement(false);
        break;
      case "calendar":
        setInResources(false);
        setInCalendar(true);
        setInChat(false);
        setInHome(false);
        setInManagement(false);
        break;
      case "chat":
        setInResources(false);
        setInCalendar(false);
        setInChat(true);
        setInHome(false);
        setInManagement(false);
        break;
      case "management":
        setInResources(false);
        setInCalendar(false);
        setInChat(false);
        setInHome(false);
        setInManagement(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => changeLocation());

  return (
    <div
      id="bottom-navigator"
      className={mobile ? "bottom-buttons-mobile" : "bottom-buttons-desktop"}
    >
      {userInfo.user_role !== undefined && (
        <ul>
          <Link to="/">
            <li className={inHome ? "activeButton" : ""}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 14 L 14 14 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"></path>
              </svg>
            </li>
          </Link>
          {userInfo.user_role.perms_app_views[0] && (
            <Link
              to="/calendar"
              onClick={() => {
                if (
                  !(
                    window.location.href.substring(
                      getPosition(window.location.href, "/", 3)
                    ) === "/calendar"
                  )
                )
                  document.getElementById("sectionCalendar").style.display =
                    "none";
                window.location.href = "/calendar";
              }}
            >
              <li className={inCalendar ? "activeButton" : ""}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  fill="currentColor"
                  className="bi bi-calendar-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5z" />
                </svg>
              </li>
            </Link>
          )}
          {isAdmin && navigator.onLine && (
            <Link to="/management">
              <li
                className={
                  inManagement
                    ? "activeButton managementButton"
                    : "managementButton"
                }
              >
                <img
                  src="https://img.icons8.com/material-rounded/96/000000/admin-settings-male.png"
                  alt="Admin Options"
                />
              </li>
            </Link>
          )}
          {userInfo.user_role.perms_app_views[1] && (
            <Link id="resources-test-button" to="/resources">
              <li className={inResources ? "activeButton" : ""}>
                <svg
                  id="clip"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="bi bi-paperclip"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
                </svg>
              </li>
            </Link>
          )}
          {userInfo.user_role.perms_app_views[2] && (
            <Link to="/chat">
              <li className={inChat ? "activeButton" : ""}>
                {badgeCount > 0 ? (
                  <div className="badgeNotifyContainer">
                    <span className="badgeNotify badgeNotifyMobile">
                      {badgeCount}
                    </span>
                  </div>
                ) : null}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  fill="currentColor"
                  className="bi bi-chat-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" />
                </svg>
              </li>
            </Link>
          )}
        </ul>
      )}
    </div>
  );
}
