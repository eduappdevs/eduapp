import "./navbar.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Menu from "../../views/menu/menu";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";

export default function Navbar({ mobile, location }) {
  const [ProfileMenuOpened, setProfileMenuOpened] = useState(false);
  const [inHome, setInHome] = useState(false);
  const [inResources, setInResources] = useState(false);
  const [inCalendar, setInCalendar] = useState(false);
  const [inChat, setInChat] = useState(false);
  let userInfo = FetchUserInfo(localStorage.userId);

  useEffect(() => {
    // eslint-disable-next-line default-case
    switch (location) {
      case "resources":
        setInResources(true);
        setInCalendar(false);
        setInChat(false);
        setInHome(false);
        break;
      case "home":
        setInResources(false);
        setInCalendar(false);
        setInChat(false);
        setInHome(true);
        break;
      case "calendar":
        setInResources(false);
        setInCalendar(true);
        setInChat(false);
        setInHome(false);
        break;
      case "chat":
        setInResources(false);
        setInCalendar(false);
        setInChat(true);
        setInHome(false);
        break;
    }
  }, [location]);
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
              <Link to="/"> Home</Link>
            </li>
            <li className={inCalendar ? "activeLocation" : console.log()}>
              <Link to="/Calendar"> Calendar</Link>
            </li>
            <li className={inResources ? "activeLocation" : console.log()}>
              <Link to="/Resources"> Resources</Link>
            </li>
            <li className={inChat ? "activeLocation" : console.log()}>
              <Link to="/Chat"> Chat</Link>
            </li>
          </ul>
        </div>
        <div
          className="profile-button"
          onClick={ProfileMenuOpened ? closeProfileMenu : openProfileMenu}
        >
          <div className="profile-button-box">
            <span className="profile-name">
              {userInfo.id !== null && userInfo !== "undefined"
                ? userInfo.id
                : "no name"}
            </span>
            <div className="profile-pic">
              <img
                src={
                  "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </nav>
      <Menu
        location={location}
        handleCloseMenu={() => {
          closeProfileMenu();
        }}
      />
    </header>
  );
}
