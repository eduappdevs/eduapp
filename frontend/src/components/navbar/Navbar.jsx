import React, { useState, useEffect } from "react";
import * as AUTH_SERVICE from "../../services/auth.service";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import { getOfflineUser } from "../../utils/OfflineManager";
import { IMG_FLBK_USER } from "../../config";
import { Dropdown } from "antd";
import Menu from "../../views/menu/Menu";
import MenuSettings from "../../views/menu/menu-settings/MenuSettings";
import ProfileSettings from "../../views/menu/profileOptions/ProfileSettings";
import useLanguage from "../../hooks/useLanguage";
import useRole from "../../hooks/useRole";
import "./Navbar.css";

/**
 * The desktop navbar of the app.
 *
 * @param {Boolean} mobile Tests for mobile or desktop display.
 * @param {String} badgeCount Count for unread notifications for chats.
 */
export default function Navbar({ mobile, badgeCount }) {
  const [inHome, setInHome] = useState(false);
  const [inResources, setInResources] = useState(false);
  const [inCalendar, setInCalendar] = useState(false);
  const [inChat, setInChat] = useState(false);
  const [inManagement, setInManagement] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const language = useLanguage();

  const [desktopMenu, setDesktopMenu] = useState(null);

  const userInfo = FetchUserInfo(getOfflineUser().user.id);
  const isAdmin = useRole(userInfo, "eduapp-admin");
  const [userImage, setUserImage] = useState(null);

  const items = [
    {
      label: <a className="dropdown-menu-option" href="#" onClick={() => {
        navigate("/menu/profile");
      }}
      >{language.menu_profile.toUpperCase()}</a>,
      key: 0
    },
    {
      label: <a className="dropdown-menu-option" href="#" onClick={() => {
        mobile
          ? (window.location.href = "/menu/settings")
          : setDesktopMenu("settings")
      }}>{language.menu_settings.toUpperCase()}</a>,
      key: 1
    },
    {
      label: <a className="dropdown-menu-option" href="#" onClick={AUTH_SERVICE.logout}>{language.logout.toUpperCase()}</a>,
      key: 2
    },
  ];

  const MenuManager = () => {
    switch (desktopMenu) {
      case "profile":
        return <ProfileSettings desktopBackTo={() => setDesktopMenu("menu")} />;
      case "settings":
        return <MenuSettings desktopBackTo={() => setDesktopMenu("home")} />;
      case "menu":
        return (
          <Menu
            desktopCloseClick={() => setDesktopMenu(null)}
            desktopProfileClick={() => setDesktopMenu("profile")}
            desktopSettingsClick={() => setDesktopMenu("settings")}
          />
        );
      default:
        return <></>;
    }
  };

  const changeLocation = () => {
    if(!userInfo?.user_role){
      return null;
    }
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

  const getPosition = (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
  };

  useEffect(() => changeLocation());

  useEffect(() => setUserImage(getOfflineUser().profile_image.thumb.url), [userInfo]);
  if(!userInfo?.user_role){return null};

  return (
    <>
      <header>
        <nav>
          <Link to="/">
            <div className="header-logo">
              <img
                src={process.env.PUBLIC_URL + "/assets/logo.png"}
                alt="logo"
              />
            </div>
          </Link>
          <div className={mobile ? "hidden" : "nav-locations"}>
            <ul>
              <li className={inHome ? "activeLocation" : console.log()}>
                <Link to="/home">{language.home}</Link>
              </li>
              {userInfo.user_role.perms_app_views[0] && (
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
                    {language.calendar}
                  </Link>
                </li>
              )}
              {isAdmin && navigator.onLine && (
                <li className={inManagement ? "activeLocation" : console.log()}>
                  <Link to="/management">{language.management}</Link>
                </li>
              )}
              {userInfo.user_role.perms_app_views[1] && (
                <li className={inResources ? "activeLocation" : console.log()}>
                  <Link to="/resources">{language.resources}</Link>
                </li>
              )}
              {userInfo.user_role.perms_app_views[2] && (
                <li className={inChat ? "activeLocation" : console.log()}>
                  {badgeCount > 0 ? (
                    <div className="badgeNotifyContainer">
                      <span className="badgeNotify badgeNotifyMobile">
                        {badgeCount}
                      </span>
                    </div>
                  ) : null}
                  <Link to="/chat">{language.chats}</Link>
                </li>
              )}
            </ul>
          </div>
          <div
            className="notifications-button"
            onClick={() => {
              window.location.href = "/notifications";
            }}
          >
            <div className="notifications-button-box">
              <div className="notifications-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-bell"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                </svg>
              </div>
            </div>
          </div>

          <Dropdown className="navbar-ant-dropdown" menu={{ items }} trigger={['click']}>
            <div className="profile-button">
              <div className="profile-button-box">
                <div className="profile-pic">
                  <img
                    src={userImage !== null ? userImage : IMG_FLBK_USER}
                    alt="Profile"
                  />
                </div>
              </div>
            </div>
          </Dropdown>
        </nav>
      </header>
      {!mobile && <MenuManager />}
    </>
  );
}
