import "./navbar.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Navbar() {
  const [ProfileMenuOpened, setProfileMenuOpened] = useState(false);
  const openProfileMenu = () => {
    setProfileMenuOpened(true);
    const menu = document.querySelector(".profile-menu");
    menu.style.display = "flex";
    menu.style.transform = "translateY(-110vh)";
    setTimeout(() => {
      menu.style.transform = "translateY(0)";
    }, 300);
  };
  const closeProfileMenu = () => {
    setProfileMenuOpened(false);
    const menu = document.querySelector(".profile-menu");

    menu.style.transform = "translateY(-110vh)";
    setTimeout(() => {
      menu.style.display = "none";
    }, 300);
  };
  return (
    <header>
      <nav>
        <Link to="/">
          <div className="header-logo">
            <img src="\assets\logo.png" alt="logo" />
          </div>
        </Link>
        <div
          className="profile-button"
          onClick={ProfileMenuOpened ? closeProfileMenu : openProfileMenu}
        >
          <div className="profile-button-box">
            <span className="profile-name">Richard clarke</span>
            <div className="profile-pic">
              <img
                src="https://img-aws.ehowcdn.com/600x400/photos.demandstudios.com/getty/article/34/162/91911271.jpg?type=webp"
                alt=""
              />
            </div>
          </div>
        </div>
      </nav>
      <div className="profile-menu">
        <ul>
          <li>
            <a href="/">Settings</a>
          </li>
          <li>
            <a href="/">Tutorial</a>
          </li>
          <li>
            <a href="/">Log out</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
