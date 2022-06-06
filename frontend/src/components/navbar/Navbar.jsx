import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import { getOfflineUser } from "../../utils/OfflineManager";
import "./Navbar.css";

export default function Navbar({ mobile, badgeCount }) {
  const [ProfileMenuOpened, setProfileMenuOpened] = useState(false);
  const [inHome, setInHome] = useState(false);
  const [inResources, setInResources] = useState(false);
  const [inCalendar, setInCalendar] = useState(false);
  const [inChat, setInChat] = useState(false);
  const [inManagement, setInManagement] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  let userInfo = FetchUserInfo(getOfflineUser().user.id);
  const [userImage, setUserImage] = useState(null);

  const changeLocation = () => {
    if (loc.pathname.substring(1) === "login")
      document.getElementsByTagName("header")[0].style.display = "none";
    else document.getElementsByTagName("header")[0].style.display = "block";

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

  const openProfileMenu = () => {
    setProfileMenuOpened(true);
    document.body.classList.remove("overflow-show");
    document.body.classList.add("overflow-hide");
    if (mobile) {
      const menu = document.querySelector(".profile-menu-mobile");
      menu.style.display = "flex";
      menu.style.transform = "translateX(110vh)";
      setTimeout(() => {
        menu.style.transform = "translateX(0)";
      }, 300);
    } else {
      const menu = document.querySelector(".profile-menu-desktop");

      menu.style.display = "flex";
      menu.style.transform = "translateX(110vh)";
      setTimeout(() => {
        menu.style.transform = "translateX(0)";
      }, 300);
    }
  };

  const getPosition = (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
  };

  const closeProfileMenu = () => {
    setProfileMenuOpened(false);
    document.body.classList.remove("overflow-hide");
    document.body.classList.add("overflow-show");
    if (mobile) {
      const menu = document.querySelector(".profile-menu-mobile");

      menu.style.transform = "translateX(110vh)";
      setTimeout(() => {
        menu.style.display = "none";
      }, 300);
    } else {
      const menu = document.querySelector(".profile-menu-desktop");

      menu.style.transform = "translateX(110vh)";
      setTimeout(() => {
        menu.style.display = "none";
      }, 300);
    }
  };

  useEffect(() => {
    changeLocation();
  });

  useEffect(() => {
    setUserImage(getOfflineUser().profile_image);
  }, [userInfo]);

  return (
    <header>
      <nav>
        <Link to="/">
          <div className="header-logo">
            <img src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="logo" />
          </div>
        </Link>
        <div className={mobile ? "hidden" : "nav-locations"}>
          <ul>
            <li className={inHome ? "activeLocation" : console.log()}>
              <Link to="/home"> Home</Link>
            </li>
            <li className={inCalendar ? "activeLocation" : console.log()}>
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
                  navigate("/calendar");
                }}
              >
                Calendar
              </Link>
            </li>
            <li className={inManagement ? "activeLocation" : console.log()}>
              <Link to="/management"> Management</Link>
            </li>
            <li className={inResources ? "activeLocation" : console.log()}>
              <Link to="/resources"> Resources</Link>
            </li>
            <li className={inChat ? "activeLocation" : console.log()}>
              <div className="badgeNotifyContainer">
                <span className="badgeNotify">{badgeCount}</span>
              </div>
              <Link to="/chat"> Chat</Link>
            </li>
          </ul>
        </div>
        <p id="wip">EduApp W.I.P</p>
        <div
          className="profile-button"
          onClick={() => {
            localStorage.previousMenuPage = window.location.href.substring(
              getPosition(window.location.href, "/", 3)
            );
            navigate("/menu");
          }}
        >
          <div className="profile-button-box">
            <div className="profile-pic">
              <img
                src={
                  userImage !== null
                    ? userImage
                    : "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                }
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
