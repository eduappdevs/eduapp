import React, { useContext, useState } from "react";
import Batcher from "./Batcher";
import SessionCSVModal from "./modals/sessionCSV-batch-modal/SessionCSVModal";
import FieldSearcher from "./FieldSearcher";
import { LanguageCtx } from "../hooks/LanguageContext";
import "../styles/scheduletoolbar.css";

export default function Toolbar(props) {
  const [language] = useContext(LanguageCtx);

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
            <FieldSearcher hasExtraFields />
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
              <Batcher type="events" />
            </li>
            <FieldSearcher hasExtraFields />
          </ul>
        </>
      ) : props.location === "users" ? (
        <>
          <ul className="scheduletoolbar-ul users-toolbar">
            <li>
              <Batcher type="users" />
            </li>
            <FieldSearcher hasExtraFields />
          </ul>
        </>
      ) : props.location === "resources" ? (
        <>
          <ul className="scheduletoolbar-ul resources-toolbar">
            <FieldSearcher hasExtraFields />
          </ul>
        </>
      ) : props.location === "institutions" ? (
        <h1>{language.configuration}</h1>
      ) : props.location === "courses" ? (
        <>
          <ul className="scheduletoolbar-ul courses-toolbar">
            <FieldSearcher hasExtraFields />
          </ul>
        </>
      ) : props.location === "subjects" ? (
        <>
          <ul className="scheduletoolbar-ul subjects-toolbar">
            <FieldSearcher hasExtraFields />
          </ul>
        </>
      ) : props.location === "enroll" ? (
        <>
          <ul className="scheduletoolbar-ul enroll-toolbar">
            <FieldSearcher />
          </ul>
        </>
      ) : props.location === "teachers" ? (
        <>
          <ul className="scheduletoolbar-ul teachers-toolbar">
            <FieldSearcher />
          </ul>
        </>
      ) : props.location === "chatConfig" ? (
        <>
          <ul className="scheduletoolbar-ul chatConfig-toolbar">
            <FieldSearcher />
          </ul>
        </>
      ) : props.location === "userRoles" ? (
        <>
          <ul className="scheduletoolbar-ul userRoles-toolbar">
            <FieldSearcher />
          </ul>
        </>
      ) : props.location === "chatParticipant" ? (
        <ul className="scheduletoolbar-ul chatParticipant-toolbar">
          <FieldSearcher />
        </ul>
      ) : (
        <h1>{language.configuration}</h1>
      )}
    </div>
  );
}
