import React from "react";
import MenuSettings from "./menu-settings/MenuSettings";
import MenuHeader from "./menuHeader/MenuHeader";
import API from "../../API";
import ProfileSettings from "./settingsProfileSettings/ProfileSettings";
export default function Menu(props) {
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
        backToName={props.location}
      />

      <ul>
        <li>
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