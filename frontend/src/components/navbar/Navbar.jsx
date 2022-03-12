import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Menu from "../../views/menu/Menu";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import MediaFix from "../MediaFixer";
import "./Navbar.css";

export default function Navbar({ mobile }) {
  const [ProfileMenuOpened, setProfileMenuOpened] = useState(false);
  const [inHome, setInHome] = useState(false);
  const [inResources, setInResources] = useState(false);
  const [inCalendar, setInCalendar] = useState(false);
  const [inChat, setInChat] = useState(false);
  const [inManagement, setInManagement] = useState(false);
  const loc = useLocation();

  let userInfo = FetchUserInfo(localStorage.userId);

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

  useEffect(() => {
    changeLocation();
  });

  const openProfileMenu = () => {
    setProfileMenuOpened(true);
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

  const closeProfileMenu = () => {
    setProfileMenuOpened(false);
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

  return (
    <header>
      <nav>
        <Link to="/">
          <div className="header-logo">
            <img src="\assets\logo.png" alt="logo" />
          </div>
        </Link>
        <div className={mobile ? "hidden" : "nav-locations"}>
          <ul>
            <li className={inHome ? "activeLocation" : console.log()}>
              <Link to="/home"> Home</Link>
            </li>
            <li className={inCalendar ? "activeLocation" : console.log()}>
              <Link to="/calendar"> Calendar</Link>
            </li>
            <li className={inManagement ? "activeLocation" : console.log()}>
              <Link to="/management"> Management</Link>
            </li>
            <li className={inResources ? "activeLocation" : console.log()}>
              <Link to="/resources"> Resources</Link>
            </li>
            <li className={inChat ? "activeLocation" : console.log()}>
              <Link to="/chat"> Chat</Link>
            </li>
          </ul>
        </div>
        <div
          className="profile-button"
          onClick={ProfileMenuOpened ? closeProfileMenu : openProfileMenu}
        >
          <div className="profile-button-box">
            <div className="profile-pic">
              <img
                src={
                  userInfo.profile_image != null
                    ? MediaFix(userInfo.profile_image.url)
                    : "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                }
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </nav>
      <Menu
        location={loc.pathname.substring(1)}
        handleCloseMenu={() => {
          closeProfileMenu();
        }}
      />
    </header>
  );
}
