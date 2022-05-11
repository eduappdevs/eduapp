import React from "react";
import "../styles/scheduletoolbar.css";
import Batcher from "./Batcher";
import Input from "./Input";
export default function Toolbar(props) {
  const handleChangeFilterSession = (event) => {
    document.dispatchEvent(
      new CustomEvent("filter_subject", { detail: event.target.value })
    );
  };

  const handleChangeFilterEvent = (event) => {
    document.dispatchEvent(
      new CustomEvent("filter_subject_event", { detail: event.target.value })
    );
  };

  const SearchFilter = (event) => {
    props.search(event.target.value);
  };

  const userRoleFilter = (event) => {
    let value = event.target.value;
    props.userRole(value);
  };

  return (
    <div className="scheduletoolbar-container">
      {props.location === "sessions" ? (
        <>
          <ul className="scheduletoolbar-ul sessions-toolbar">
            <li>
              <Batcher type="sessions" />
            </li>
            <li className="subjectbar-container">
              <select
                className="subjectOption"
                onChange={(e) => {
                  handleChangeFilterSession(e);
                }}
                name="subject"
                id="subject_id"
              >
                <option defaultValue={"--"}>
                  {props.language.chooseSubject}
                </option>
                {props.subjects.map((subject) =>
                  subject.id !== 1 ? (
                    <option
                      key={subject.id}
                      value={subject.id + "_" + subject.name}
                    >
                      {subject.name}
                    </option>
                  ) : (
                    console.log()
                  )
                )}
              </select>
            </li>
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <Input
                type="text"
                className="searchbar_toolbar"
                autoComplete="off"
                placeholder={props.language.search}
              />
            </li>
          </ul>
        </>
      ) : props.location === "events" ? (
        <>
          <ul className="scheduletoolbar-ul events-toolbar">
            <li>
              <Batcher type="events" language={props.language} />
            </li>
            <li className="subjectbar-container">
              <select
                className="subjectOption"
                onChange={(e) => {
                  handleChangeFilterEvent(e);
                }}
                name="subject"
                id="subject_id"
              >
                <option defaultValue={"--"}>
                  {props.language.chooseSubject}
                </option>
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
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <Input
                type="text"
                className="searchbar_toolbar"
                autoComplete="off"
                placeholder={props.language.search}
              />
            </li>
          </ul>
        </>
      ) : props.location === "users" ? (
        <>
          <ul className="scheduletoolbar-ul users-toolbar">
            <li>
              <Batcher type="users" language={props.language} />
            </li>

            <li>
              <select
                onChange={userRoleFilter}
                name="subjects"
                id="subjects-select"
              >
                <option value="ALL">{props.language.viewAllRoles}</option>
                <option value="ADMIN">{props.language.admin}</option>
                <option value="STUDENT">{props.language.student}</option>
              </select>
            </li>
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <Input
                type="text"
                className="searchbar_toolbar"
                autoComplete="off"
                placeholder={props.language.search}
              />
            </li>
          </ul>
        </>
      ) : props.location === "resources" ? (
        <>
          <ul className="scheduletoolbar-ul resources-toolbar">
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <Input
                type="text"
                className="searchbar_toolbar"
                autoComplete="off"
                placeholder={props.language.search}
              />
            </li>
          </ul>
        </>
      ) : props.location === "institutions" ? (
        <>
          <ul className="scheduletoolbar-ul institutions-toolbar">
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <Input
                type="text"
                className="searchbar_toolbar"
                autoComplete="off"
                placeholder={props.language.search}
              />
            </li>
          </ul>
        </>
      ) : props.location === "courses" ? (
        <>
          <ul className="scheduletoolbar-ul courses-toolbar">
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <Input
                placeholder={props.language.search}
                className="searchbar_toolbar"
                autoComplete="off"
              />
            </li>
          </ul>
        </>
      ) : props.location === "subjects" ? (
        <>
          <ul className="scheduletoolbar-ul subjects-toolbar">
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>

              <Input
                placeholder={props.language.search}
                className="searchbar_toolbar"
                autoComplete="off"
              />
            </li>
          </ul>
        </>
      ) : props.location === "enroll" ? (
        <>
          <ul className="scheduletoolbar-ul enroll-toolbar">
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>
              <Input
                type="text"
                className="searchbar_toolbar"
                autoComplete="off"
                placeholder={props.language.search}
              />
            </li>
          </ul>
        </>
      ) : props.location === "teachers" ? (
        <>
          <ul className="scheduletoolbar-ul teachers-toolbar">
            <li onChange={SearchFilter} className="searchbar-container">
              <span className="searchicon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </span>
              <Input
                type="text"
                className="searchbar_toolbar"
                autoComplete="off"
                placeholder={props.language.search}
              />
            </li>
          </ul>
        </>
      ) : (
        <h1>Communication configuration</h1>
      )}{" "}
    </div>
  );
}
