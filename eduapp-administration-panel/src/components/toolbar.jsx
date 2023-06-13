import React, { useCallback, useContext, useState } from "react";
import Batcher from "./Batcher";
import SessionCSVModal from "./modals/sessionCSV-batch-modal/SessionCSVModal";
import StandardModal from "./modals/standard-modal/StandardModal";

import FieldSearcher from "./FieldSearcher";
import { LanguageCtx } from "../hooks/LanguageContext";
import "../styles/scheduletoolbar.css";

export default function Toolbar(props) {
  const [language] = useContext(LanguageCtx);

  const [modalOpen, setModalOpen] = useState(false);

  const [popupType, setPopupType] = useState("");
  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");

  const messageError = useCallback((type, icon, pop, text) => {
    setPopup(pop);
    setPopupIcon(icon);
    setPopupType(type);
    setPopupText(text);
  }, []);

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
                  <p>{language.csvFileUpload}</p>
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
              messageError={messageError}
            />
          ) : null}
        </>
      ) : props.location === "events" ? (
        <>
          <ul className="scheduletoolbar-ul events-toolbar">
            <li>
              <Batcher type="events" />
            </li>
            <FieldSearcher />
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
      ) : props.location === "enroll_subjects" ? (
        <>
          <ul className="scheduletoolbar-ul enroll_subjects-toolbar">
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
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        onYesAction={() => {
          setPopup(false);
        }}
        onNoAction={() => {
          setPopup(false)
        }}
        onCloseAction={() => {
          setPopup(false);
        }}
        hasIconAnimation
        hasTransit
      />
    </div>
  );
}
