import React, { useState } from "react";
import Batcher from "./Batcher";
import SessionCSVModal from "./modals/sessionCSV-batch-modal/SessionCSVModal";
import FieldSearcher from "./FieldSearcher";
import "../styles/scheduletoolbar.css";

export default function Toolbar(props) {
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleChangeFilterEnrollment = (event) => {
    document.dispatchEvent(
      new CustomEvent("filter_subject_enroll", { detail: event.target.value })
    );
  };
  const handleChangeFilterCourses = (event) => {
    document.dispatchEvent(
      new CustomEvent("filter_subject_course", { detail: event.target.value })
    );
  };

  const handleChangeFilterTeacher = (event) => {
    document.dispatchEvent(
      new CustomEvent("filter_subject_teacher", { detail: event.target.value })
    );
  };

  return (
    <div className="scheduletoolbar-container">
      {props.location === "sessions" ? (
        <>
          <ul className="scheduletoolbar-ul sessions-toolbar">
            <li>
              <div
                className="check-button-containter"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                <div className="check-button-main">
                  <p>CSV file upload</p>
                </div>
              </div>
            </li>
            <FieldSearcher language={props.language} />
          </ul>
          {modalOpen === true ? (
            <SessionCSVModal
              closed={() => {
                setModalOpen(false);
                document.getElementById(
                  "controlPanelContentContainer"
                ).style.overflow = "scroll";
              }}
              type={() => {
                document.getElementById(
                  "controlPanelContentContainer"
                ).style.overflow = "scroll";
              }}
            />
          ) : null}
        </>
      ) : props.location === "events" ? (
        <>
          <ul className="scheduletoolbar-ul events-toolbar">
            <li>
              <Batcher type="events" language={props.language} />
            </li>
            <FieldSearcher language={props.language} />
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
          </ul>
        </>
      ) : props.location === "users" ? (
        <>
          <ul className="scheduletoolbar-ul users-toolbar">
            <li>
              <Batcher type="users" language={props.language} />
            </li>
            <FieldSearcher language={props.language} />
            <li className="subjectbar-container">
              <select
                name="subjects"
                id="subjects-select"
                className="subjectOption"
              >
                <option value="ALL">{props.language.viewAllRoles}</option>
                <option value="ADMIN">{props.language.admin}</option>
                <option value="STUDENT">{props.language.student}</option>
              </select>
            </li>
          </ul>
        </>
      ) : props.location === "resources" ? (
        <>
          <ul className="scheduletoolbar-ul resources-toolbar">
            <FieldSearcher language={props.language} />
          </ul>
        </>
      ) : props.location === "institutions" ? (
        <h1>{props.language.configuration}</h1>
      ) : props.location === "courses" ? (
        <>
          <ul className="scheduletoolbar-ul courses-toolbar">
            <FieldSearcher language={props.language} />
          </ul>
        </>
      ) : props.location === "subjects" ? (
        <>
          <ul className="scheduletoolbar-ul subjects-toolbar">
            <FieldSearcher language={props.language} />
            <li className="subjectbar-container">
              <select
                className="subjectOption"
                onChange={(e) => {
                  handleChangeFilterCourses(e);
                }}
                name="subject"
                id="subject_id"
              >
                <option defaultValue={"--"}>
                  {props.language.chooseCourse}
                </option>

                {props.courses.map((course) => (
                  <option key={course.id} value={course.id + "_" + course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </>
      ) : props.location === "enroll" ? (
        <>
          <ul className="scheduletoolbar-ul enroll-toolbar">
            <FieldSearcher language={props.language} />
            <li className="subjectbar-container">
              <select
                className="subjectOption"
                onChange={(e) => {
                  handleChangeFilterEnrollment(e);
                }}
                name="subject"
                id="subject_id"
              >
                <option defaultValue={"--"}>
                  {props.language.chooseCourse}
                </option>
                {props.courses.map((course) => (
                  <option key={course.id} value={course.id + "_" + course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </>
      ) : props.location === "teachers" ? (
        <>
          <ul className="scheduletoolbar-ul teachers-toolbar">
            <FieldSearcher language={props.language} />
            <li className="subjectbar-container">
              <select
                className="subjectOption"
                onChange={(e) => {
                  handleChangeFilterTeacher(e);
                }}
                name="subject"
                id="subject_id"
              >
                <option defaultValue={"--"}>
                  {props.language.chooseCourse}
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
          </ul>
        </>
      ) : props.location === "chatConfig" ? (
        <>
          <ul className="scheduletoolbar-ul teachers-toolbar">
            <FieldSearcher language={props.language} />
          </ul>
        </>
      ) : (
        <h1>{props.language.configuration}</h1>
      )}
    </div>
  );
}
