/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import MenuHeader from "./menuHeader/MenuHeader";
import API from "../../API";
import "./Menu.css";

export default function Menu(props) {
  return (
    <div
      className={
        window.innerWidth < 1000
          ? "profile-menu-mobile"
          : "profile-menu-desktop"
      }
      style={{ zIndex: 9999999 }}
    >
      <MenuHeader
        backTo={() => {
          window.location.href = localStorage.previousMenuPage;
        }}
        location={"MENU"}
      />
      <ul>
        <li>
          <a
            onClick={() => {
              window.location.href = "/menu/profile";
            }}
          >
            PROFILE
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              window.location.href = "/menu/settings";
            }}
          >
            Settings
          </a>
        </li>
        <li>
          <a onClick={API.logout}>Log out</a>
        </li>
      </ul>
    </div>
  );
}
