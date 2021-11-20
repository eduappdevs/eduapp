import "./navbar.css";
import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <header>
      <Link to="/">
        <div className="header-logo">
          <img src="\assets\logo.png" alt="logo" />
        </div>
      </Link>
      <div className="profile-pic-button">
        <img
          src="https://img-aws.ehowcdn.com/600x400/photos.demandstudios.com/getty/article/34/162/91911271.jpg?type=webp"
          alt=""
        />
      </div>
      <div className="profile-menu">
        <ul>
          <li><a href="/">Settings</a></li>
          <li><a href="/">Tutorial</a></li>
          <li><a href="/">Log out</a></li>
        </ul>
      </div>
    </header>
  );
}
