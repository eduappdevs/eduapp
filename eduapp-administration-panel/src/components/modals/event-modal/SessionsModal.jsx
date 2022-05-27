import React from "react";
import "./SessionsModal.css";

export default function SessionsModal({ show, language, info, onCloseModal }) {
  return (
    <>
      <div
        className="session-modal-container-main"
        style={{ display: show ? "flex" : "none" }}
      >
        {show ? (
          <>
            <div className="session-modal-contents">
              <div className="session-modal-header">
                <button className="modal-button-close" onClick={onCloseModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-x-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="session-modal-body">
                <div className="session-modal-name">
                  <p>{language.name}</p>
                  <input type="text" required value={info.name} />
                </div>
                <div className="session-modal-code">
                  <p>{language.subjects}</p>
                  <input type="text" required value={info.subject_name} />
                </div>
                <div className="session-modal-from-date">
                  <p>From date:</p>
                  <input type="date" required />
                </div>
                <div className="session-modal-to-date">
                  <p>To date:</p>
                  <input type="date" required />
                </div>
                <div className="session-modal-from-time">
                  <p>From time:</p>
                  <input type="Time" required />
                </div>
                <div className="session-modal-to-time">
                  <p>To time:</p>
                  <input type="Time" required />
                </div>
                <p>{language.weekdays}: </p>
                <div className="session-modal-weekdays">
                  <p>{language.mon}</p>
                  <input type="checkbox" />
                  <p>{language.tue}</p>
                  <input type="checkbox" />
                  <p>{language.wen}</p>
                  <input type="checkbox" />
                  <p>{language.thu}</p>
                  <input type="checkbox" />
                  <p>{language.fri}</p>
                  <input type="checkbox" />
                  <p>{language.sat}</p>
                  <input type="checkbox" />
                  <p>{language.sun}</p>
                  <input type="checkbox" />
                </div>
                <div className="session-modal-week">
                  <p>{language.repeatedEvery}</p>
                  <input type="number" required />
                  <p>{language.week}</p>
                </div>
                <div className="session-modal-conference-link">
                  <p>{language.streaming}</p>
                  <input type="text" required value={info.streaming} />
                </div>
                <div className="session-modal-learning-link">
                  <p>{language.resources}</p>
                  <input type="text" required value={info.resource} />
                </div>
                <div className="session-modal-chat-link">
                  <p>{language.chatLink}</p>
                  <input type="text" required value={info.chat} />
                </div>

                <div className="session-modal-button">
                  <button>{language.add}</button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
