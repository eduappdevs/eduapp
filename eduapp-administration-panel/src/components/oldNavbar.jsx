import React from "react";
import "../styles/oldNavbar.css";

export default function OldNavbar() {
  const changeLocation = (location) => {
    let institutions = document.getElementById("cp-institutions");
    let courses = document.getElementById("cp-courses");
    let users = document.getElementById("cp-users");
    let institutionsButton = document.getElementById("institutions");
    let coursesButton = document.getElementById("courses");
    let usersButton = document.getElementById("users");

    // eslint-disable-next-line default-case
    switch (location) {
      case "institutions":
        institutions.classList.remove("hidden");
        courses.classList.add("hidden");
        users.classList.add("hidden");
        institutionsButton.classList.add("old_old_active");
        coursesButton.classList.remove("old_old_active");
        usersButton.classList.remove("old_old_active");
        break;
      // eslint-disable-next-line no-fallthrough
      case "courses":
        institutions.classList.add("hidden");
        courses.classList.remove("hidden");
        users.classList.add("hidden");
        institutionsButton.classList.remove("old_active");
        coursesButton.classList.add("old_active");
        usersButton.classList.remove("old_active");
        break;
      // eslint-disable-next-line no-fallthrough
      case "users":
        institutions.classList.add("hidden");
        courses.classList.add("hidden");
        users.classList.remove("hidden");
        institutionsButton.classList.remove("old_active");
        coursesButton.classList.remove("old_active");
        usersButton.classList.add("old_active");
        break;
    }
  };
  return (
    <div className="old_navbar-container">
      <div className="old_logo">
        <img
          src="http://eduapp-project.eu/wp-content/uploads/2021/03/Logo-EduApp-1-150x150.png"
          alt="eduapplogo"
        />
      </div>
      <div
        className="institutions old_active"
        id="institutions"
        onClick={() => {
          changeLocation("institutions");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-building"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
          />
          <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
        </svg>
      </div>
      <div
        className="courses"
        id="courses"
        onClick={() => {
          changeLocation("courses");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-book-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
        </svg>
      </div>
      <div
        className="users"
        id="users"
        onClick={() => {
          changeLocation("users");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-people-fill"
          viewBox="0 0 16 16"
        >
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path
            fill-rule="evenodd"
            d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
          />
          <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
        </svg>
      </div>
    </div>
  );
}
