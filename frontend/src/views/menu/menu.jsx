import React from "react";
import MenuSettings from "./menu-settings/MenuSettings";
import MenuHeader from "./menuHeader/MenuHeader";
import API from "../../API";
import ProfileSettings from "./profileOptions/ProfileSettings";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";

export default function Menu(props) {
  let userInfo = FetchUserInfo(localStorage.userId)
  const openMenuSettings = () => {
    document
      .getElementsByClassName("MenuSettings__main-container")[0]
      .classList.remove("MenuSettings__hidden");
  };
  const openProfileSettings = () => {
    document
      .getElementsByClassName("profileSettings_container")[0]
      .classList.remove("profileSettings__hidden");
  };
  return (
    <div
    id='profile-menu-container'
      className={
        window.matchMedia("(max-width:1100px)").matches
          ? "profile-menu-mobile"
          : "profile-menu-desktop"
      }
    >
      <MenuHeader
        backTo={() => {
          props.handleCloseMenu();
        }}
        location="Menu"
        
      />

      <ul>
        <li id='profileOptionTest'>
          <a
            onClick={() => {
              openProfileSettings();
            }}
          >
            PROFILE
          </a>
          <ProfileSettings />
        </li>
        <li>
          <a
            onClick={() => {
              openMenuSettings();
            }}
          >
            Settings
          </a>
          <MenuSettings />
        </li>
        <li>
          <a>Tutorial</a>
        </li>
        
        <li>
          <a onClick={API.logout}>Log out</a>
        </li>
      </ul>
    </div>
  );
}
