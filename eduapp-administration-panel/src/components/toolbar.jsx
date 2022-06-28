import React, { useState } from "react";
import Batcher from "./Batcher";
import SessionCSVModal from "./modals/sessionCSV-batch-modal/SessionCSVModal";
import FieldSearcher from "./FieldSearcher";
import "../styles/scheduletoolbar.css";

export default function Toolbar(props) {
  const [modalOpen, setModalOpen] = useState(false);

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
          </ul>
        </>
      ) : props.location === "users" ? (
        <>
          <ul className="scheduletoolbar-ul users-toolbar">
            <li>
              <Batcher type="users" language={props.language} />
            </li>
            <FieldSearcher language={props.language} />
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
          </ul>
        </>
      ) : props.location === "enroll" ? (
        <>
          <ul className="scheduletoolbar-ul enroll-toolbar">
            <FieldSearcher language={props.language} />
          </ul>
        </>
      ) : props.location === "teachers" ? (
        <>
          <ul className="scheduletoolbar-ul teachers-toolbar">
            <FieldSearcher language={props.language} />
          </ul>
        </>
      ) : props.location === "chatConfig" ? (
        <>
          <ul className="scheduletoolbar-ul teachers-toolbar">
            <FieldSearcher language={props.language} />
          </ul>
        </>
      ) : props.location === "userRoles" ? (
        <>
          <ul className="scheduletoolbar-ul userRoles-toolbar">
            <FieldSearcher language={props.language} />
          </ul>
        </>
      ) : (
        <h1>{props.language.configuration}</h1>
      )}
    </div>
  );
}
