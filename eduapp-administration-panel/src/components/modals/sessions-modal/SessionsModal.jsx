import { useState, useEffect } from "react";
import asynchronizeRequest from "../../../API";
import * as SCHEDULESERVICE from "../../../services/schedule.service";
import StandardModal from "../standard-modal/StandardModal";
import "./SessionsModal.css";

export default function SessionsModal({ show, language, info, onCloseModal }) {
  const [changeName, setChangeName] = useState([]);
  const [changeStreamingLink, setChangeStreamingLink] = useState([]);
  const [changeResourcesLink, setChangeResourcesLink] = useState([]);
  const [changeChatLink, setChangeChatLink] = useState([]);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");

  const alertCreate = async () => {
    setPopupText("Required information is missing.");
    setPopupType("error");
    setPopup(true);
  };

  const switchEditState = (state) => {
    if (state) {
      document.getElementById("controlPanelContentContainer").style.overflowX =
        "auto";
    } else {
      document.getElementById("scroll").scrollIntoView(true);
      document.getElementById("standard-modal").style.width = "101%";
      document.getElementById("standard-modal").style.height = "100%";
    }
  };

  const submitSessionModal = (e) => {
    let name = document.getElementById("session-name").value;
    let streamingLink = document.getElementById("session-streaming").value;
    let resourcesLink = document.getElementById("session-resources").value;
    let chatLink = document.getElementById("session-chat").value;
    let subject = document.getElementById("session-subject").value;
    let startDate = document.getElementById("session-start-date").value;
    let endDate = document.getElementById("session-end-date").value;
    let startHour = document.getElementById("session-start-hour").value;
    let endHour = document.getElementById("session-end-hour").value;
    let mondayCheck = document.getElementById("monday-check").checked;
    let tuesdayCheck = document.getElementById("tuesday-check").checked;
    let wednesdayCheck = document.getElementById("wednesday-check").checked;
    let thursdayCheck = document.getElementById("thursday-check").checked;
    let fridayCheck = document.getElementById("friday-check").checked;
    let saturdayCheck = document.getElementById("saturday-check").checked;
    let sundayCheck = document.getElementById("sunday-check").checked;
    let numberRepeat = parseInt(document.getElementById("number-repeat").value);
    let startDateHour = startDate + "T" + startHour;
    let endDateHour = endDate + "T" + endHour;
    if (
      name === "" &&
      streamingLink === "" &&
      resourcesLink === "" &&
      chatLink === "" &&
      subject === "" &&
      startDateHour === "" &&
      endDateHour === ""
    ) {
      alertCreate();
    } else {
      if (
        mondayCheck === true ||
        tuesdayCheck === true ||
        wednesdayCheck === true ||
        thursdayCheck === true ||
        fridayCheck === true ||
        saturdayCheck === true ||
        sundayCheck === true
      ) {
        let checkDays = [
          mondayCheck,
          tuesdayCheck,
          wednesdayCheck,
          thursdayCheck,
          fridayCheck,
          saturdayCheck,
          sundayCheck,
        ];

        let start = new Date(startDateHour);
        let end = new Date(endDateHour);
        let diff = end - start;
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        let session = {
          session_name: name,
          session_start_date: startDateHour,
          session_end_date: endDateHour,
          streaming_platform: streamingLink,
          resources_platform: resourcesLink,
          session_chat_id: chatLink,
          subject_id: info.subject.split("_")[1],
          total_weeks: weeks,
          check_week_days: checkDays,
          diff_days: parseInt(days),
          week_repeat:
            numberRepeat < 1 ? 0 : numberRepeat < 2 ? 2 : numberRepeat,
        };

        asynchronizeRequest(function () {
          SCHEDULESERVICE.createSessionBatch(session)
            .then((response) => {
              if (response) {
                setPopupText("Session created successfully.");
                setPopupType("success");
                setPopup(true);
                onCloseModal();
              }
            })
            .catch((Error) => {
              if (Error) {
                setPopupText("Error creating session.");
                setPopupType("error");
                setPopup(true);
              }
            });
        }).then((e) => {
          if (e) {
            setPopup(true);
            setPopupText(
              "The calendar session could not be published, check if you have an internet connection."
            );
            setPopupIcon("error");
          }
        });
      } else {
        alertCreate();
      }
    }
  };

  useEffect(() => {
    if (info) {
      switchEditState(false);
      setChangeName(info.name);
      setChangeStreamingLink(info.streaming);
      setChangeChatLink(info.chat);
      setChangeResourcesLink(info.resource);
    }
  }, [info]);

  return (
    <>
      <div
        className="session-modal-container-main"
        id="scroll"
        style={{ display: show ? "flex" : "none" }}
      >
        {show ? (
          <>
            <div className="session-modal-contents">
              <div className="session-modal-header">
                <button
                  className="modal-button-close"
                  onClick={() => {
                    switchEditState(true);
                    onCloseModal();
                  }}
                >
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
                  <input
                    id="session-name"
                    type="text"
                    required
                    value={changeName}
                    onChange={(e) => {
                      setChangeName(e.target.value);
                    }}
                  />
                </div>
                <div className="session-modal-conference-link">
                  <p>{language.streaming}</p>
                  <input
                    id="session-streaming"
                    type="text"
                    required
                    value={changeStreamingLink}
                    onChange={(e) => {
                      setChangeStreamingLink(e.target.value);
                    }}
                  />
                </div>
                <div className="session-modal-learning-link">
                  <p>{language.resources}</p>
                  <input
                    id="session-resources"
                    type="text"
                    required
                    value={changeResourcesLink}
                    onChange={(e) => {
                      setChangeResourcesLink(e.target.value);
                    }}
                  />
                </div>
                <div className="session-modal-chat-link">
                  <p>{language.chatLink}</p>
                  <input
                    id="session-chat"
                    type="text"
                    required
                    value={changeChatLink}
                    onChange={(e) => {
                      setChangeChatLink(e.target.value);
                    }}
                  />
                </div>
                <div className="session-modal-code">
                  <p>{language.subjects}</p>
                  <input
                    id="session-subject"
                    type="text"
                    disabled
                    value={info.subject.split("_")[0]}
                  />
                </div>
                <div className="session-start-date">
                  <p>From date:</p>
                  <input id="session-start-date" type="date" required />
                </div>
                <div className="session-end-date">
                  <p>To date:</p>
                  <input id="session-end-date" type="date" required />
                </div>
                <div className="session-start-hour">
                  <p>From time:</p>
                  <input id="session-start-hour" type="Time" required />
                </div>
                <div className="session-end-hour">
                  <p>To time:</p>
                  <input id="session-end-hour" type="Time" required />
                </div>
                <p>{language.weekdays}: </p>
                <div className="session-modal-weekdays">
                  <p>{language.mon}</p>
                  <input id="monday-check" type="checkbox" />
                  <p>{language.tue}</p>
                  <input id="tuesday-check" type="checkbox" />
                  <p>{language.wen}</p>
                  <input id="wednesday-check" type="checkbox" />
                  <p>{language.thu}</p>
                  <input id="thursday-check" type="checkbox" />
                  <p>{language.fri}</p>
                  <input id="friday-check" type="checkbox" />
                  <p>{language.sat}</p>
                  <input id="saturday-check" type="checkbox" />
                  <p>{language.sun}</p>
                  <input id="sunday-check" type="checkbox" />
                </div>
                <div className="session-modal-week">
                  <p>{language.repeatedEvery}</p>
                  <input id="number-repeat" type="number" required min={0} />
                  <p>{language.week}</p>
                </div>

                <div className="session-modal-button">
                  <button
                    onClick={() => {
                      submitSessionModal();
                    }}
                  >
                    {language.add}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onCloseAction={() => {
          setPopup(false);
          switchEditState(true);
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
