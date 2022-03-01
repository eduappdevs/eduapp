import React from "react";
import "../styles/scheduletoolbar.css";

export default function Toolbar(props) {
  return (
    <div className="scheduletoolbar-container">
      {props.location === "sessions" ? (
        <>
          <h1>Sessions</h1>
          <ul className="scheduletoolbar-ul sessions-toolbar">
            <li>
              {" "}
              <p> Add </p>
            </li>
            <li>
              {" "}
              <p> Load </p>
            </li>
            <li>
              <select name="subjects" id="subjects-select">
                <option value="ALL">View all subjects</option>
                <option value="PGV">PGV</option>
                <option value="PRL">PRL</option>
              </select>
            </li>
            <li>
              <input type="text" placeholder="Search..." />
            </li>
          </ul>
        </>
      ) : props.location === "events" ? (
        <>
          <h1>Events</h1>
          <ul className="scheduletoolbar-ul events-toolbar">
            <li>
              {" "}
              <p> Add </p>
            </li>
            <li>
              {" "}
              <p> Load </p>
            </li>
          </ul>
        </>
      ) : props.location === "users" ? (
        <>
          <h1>Users</h1>
          <ul className="scheduletoolbar-ul users-toolbar">
            <li>
              {" "}
              <p> Add </p>
            </li>
            <li>
              {" "}
              <p> Load </p>
            </li>
            <li>
              <select name="subjects" id="subjects-select">
                <option value="ALL">View all roles</option>
                <option value="ADMIN">Admin</option>
                <option value="STUDENT">Student</option>
              </select>
            </li>
            <li>
              <input type="text" placeholder="Search..." />
            </li>
          </ul>
        </>
      ) : props.location === "resources" ? (
        <>
          <h1>Resource configuration</h1>
        </>
      ) : props.location === "institutions" ? (
        <>
          <h1>Institution configuration</h1>
        </>
      ) : props.location === "courses" ? (
        <>
          <h1>Courses configuration</h1>
        </>
      ) : props.location === "subjects" ? (
        <>
          <h1>Subjects configuration</h1>
        </>
      ) : (
        <h1>Communication configuration</h1>
      )}
    </div>
  );
}
