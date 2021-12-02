import React from "react";
import MenuSettings from "./menu-settings/MenuSettings";
import MenuHeader from "./menuHeader/MenuHeader";
export default function Menu(props) {
  const openMenuSettings = () => {
    document
      .getElementsByClassName("MenuSettings__main-container")[0]
      .classList.remove("MenuSettings__hidden");
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
        backToName={"Close"}
      />

      <ul>
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
          <a>Log out</a>
        </li>
      </ul>
    </div>
  );
}
