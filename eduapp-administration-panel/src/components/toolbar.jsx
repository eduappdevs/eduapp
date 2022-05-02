import React from "react";
import "../styles/scheduletoolbar.css";
import LoadUsersCSV from "./loadUsersCSV";

export default function Toolbar(props) {
  const handleChangeFilterSession = (event) => {
    document.dispatchEvent(
      new CustomEvent("filter_subject", {
        detail: event.target.value,
      })
    );
  };

  const usersSearchFilter = (event) => {
    let value = event.target.value;
    props.search(value);
  };

  const userRoleFilter = (event) => {
    let value = event.target.value;
    props.userRole(value);
  };
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
              <select
                onChange={(e) => {
                  handleChangeFilterSession(e);
                }}
                name="subject"
                id="subject_id"
              >
                <option defaultValue={"--"}>Choose subject</option>
                {props.subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id + "_" + subject.name}
                  >
                    {subject.name}
                  </option>
                ))}
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
              <LoadUsersCSV buttonText="Load" />
            </li>

            <li>
              <select
                onChange={userRoleFilter}
                name="subjects"
                id="subjects-select"
              >
                <option value="ALL">View all roles</option>
                <option value="ADMIN">Admin</option>
                <option value="STUDENT">Student</option>
              </select>
            </li>
            <li>
              <input
                onChange={usersSearchFilter}
                type="text"
                placeholder="Search..."
              />
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
      ) : props.location === "enroll" ? (
        <>
          <h1>Enroll a user</h1>
        </>
      ) : props.location === "chatMessage" ? (
        <>
          <h1>Message</h1>
        </>
      ) : props.location === "chatParticipant" ? (
        <>
          <h1>Participant</h1>
        </>
      ) : props.location === "chatConfig" ? (
        <>
          <h1>Chat</h1>
        </>
      ) : props.location === "teachers" ? (
        <>
          <h1>Teacher Configuration</h1>
        </>
      ) : (
        <h1>Communication configuration</h1>
      )}
    </div>
  );
}
