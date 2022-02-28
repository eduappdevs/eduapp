import React from "react";
import "../styles/navbar.css";

export default function Navbar(props) {
  // const changeLocation = (location) => {
  //   let institutions = document.getElementById("cp-institutions");
  //   let courses = document.getElementById("cp-courses");
  //   let users = document.getElementById("cp-users");
  //   let institutionsButton = document.getElementById("institutions");
  //   let coursesButton = document.getElementById("courses");
  //   let usersButton = document.getElementById("users");

  //   switch (location) {
  //     case "institutions":
  //       institutions.classList.remove("hidden");
  //       courses.classList.add("hidden");
  //       users.classList.add("hidden");
  //       institutionsButton.classList.add("active");
  //       coursesButton.classList.remove("active");
  //       usersButton.classList.remove("active");
  //       break;
  //     case "courses":
  //       institutions.classList.add("hidden");
  //       courses.classList.remove("hidden");
  //       users.classList.add("hidden");
  //       institutionsButton.classList.remove("active");
  //       coursesButton.classList.add("active");
  //       usersButton.classList.remove("active");
  //       break;
  //     case "users":
  //       institutions.classList.add("hidden");
  //       courses.classList.add("hidden");
  //       users.classList.remove("hidden");
  //       institutionsButton.classList.remove("active");
  //       coursesButton.classList.remove("active");
  //       usersButton.classList.add("active");
  //       break;
  //     default:
  //       break;
  //   }
  // };

  return (
    <div className="navbar-container">
      <div className="logo">
        <img
          src="http://eduapp-project.eu/wp-content/uploads/2021/03/Logo-EduApp-1-150x150.png"
          alt="eduapplogo"
        />
        <p>Admin</p>
      </div>
      <div className="schedule-button-container button-container">
        <span>
          <p>Schedule</p>
        </span>
        <ul className="button-suboptions">
          <li
            onClick={() => {
              props.toolbarLocation("sessions");
            }}
            className="button-suboptions"
          >
            <p>Sessions</p>
          </li>
          <li
            onClick={() => {
              props.toolbarLocation("events");
            }}
            className="button-suboptions"
          >
            <p>Events</p>
          </li>
        </ul>
      </div>
      <div className="users-button-container button-container">
        <span>
          <p>Users</p>
        </span>
        <ul className="button-suboptions">
          <li
            onClick={() => {
              props.toolbarLocation("users");
            }}
            className="button-suboptions"
          >
            <p>Users</p>
          </li>
        </ul>
      </div>
      <div className="settings-button-container button-container">
        <span>
          <p> Settings</p>
        </span>
        <ul className="button-suboptions">
          <li className="button-suboptions">
            <p
              onClick={() => {
                props.toolbarLocation("institutions");
              }}
            >
              Institution
            </p>
          </li>
          <li className="button-suboptions">
            <p
              onClick={() => {
                props.toolbarLocation("courses");
              }}
            >
              Courses
            </p>
          </li>
          <li
            onClick={() => {
              props.toolbarLocation("subjects");
            }}
            className="button-suboptions"
          >
            <p>Subjects</p>
          </li>
          <li className="button-suboptions">
            <p
              onClick={() => {
                props.toolbarLocation("resources");
              }}
            >
              Resources
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
