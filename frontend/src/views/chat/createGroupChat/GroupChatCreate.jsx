import React, { useState, useEffect } from "react";
import AppHeader from "../../../components/appHeader/AppHeader";
import { asynchronizeRequest } from "../../../API.js";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import * as CHAT_SERVICE from "../../../services/chat.service";
import * as USER_SERVICE from "../../../services/user.service";
import "./GroupChatCreate.css";

export default function GroupChatCreate() {
  const [displayImageWarning, setWarnDisplay] = useState("none");
  const [changeImage, setChangeImage] = useState(null);
  const [imageWarningText, setWarningText] = useState(
    "Image size is larger than 2MB"
  );
  const [groupName, setGroupName] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [participants, setParticipants] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [createButton, setCreateButton] = useState("Create");

  const displayWarning = (text) => {
    setWarningText(text);
    setWarnDisplay("block");
    setTimeout(() => {
      setWarnDisplay("none");
    }, 2000);
  };

  const changeImagePreview = (newPreview) => {
    const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
    if (imageRegex.test(newPreview.target.files[0].name)) {
      setWarnDisplay("none");
      if (newPreview.target.files && newPreview.target.files[0]) {
        if (newPreview.target.files[0].size / 1000 / 1000 < 2) {
          document
            .getElementById("profileImage_preview")
            .setAttribute(
              "src",
              window.URL.createObjectURL(newPreview.target.files[0])
            );
          setWarnDisplay("none");
          setChangeImage(newPreview.target.files[0]);
        } else displayWarning("Image size is larger than 2MB");
      } else displayWarning("No provided image");
    } else displayWarning("File is not an image");
  };

  const matchUsers = (nameInput) => {
    if (nameInput.length > 0) {
      let currentParticipants = [];
      for (let p of participants) currentParticipants.push(p.id);

      asynchronizeRequest(async () => {
        let match = await USER_SERVICE.findByName(nameInput);

        let filteredUsers = [];
        for (let u of match.data) {
          if (
            currentParticipants.includes(u.id) ||
            u.id === parseInt(localStorage.userId)
          )
            continue;
          filteredUsers.push(u);
        }

        setSuggestedUsers(filteredUsers);
      }).then((err) => {
        if (err) console.log(err);
      });
    } else {
      setSuggestedUsers([]);
    }
  };

  const createChat = () => {
    if (groupName.length < 1) {
      setPopupText("Please enter a group name");
      setShowPopup(true);
      return;
    }

    if (participants.length < 2) {
      setPopupText("Please add at least 2 participants");
      setShowPopup(true);
      return;
    }

    if (createButton === "Create") {
      setCreateButton("Creating...");
      let finalParticipants = [];
      for (let p of participants) finalParticipants.push(p.id);
      asynchronizeRequest(async () => {
        let chat_id = await CHAT_SERVICE.createCompleteChat({
          base: {
            chat_name: groupName,
            isGroup: true,
          },
          participants: {
            user_ids: [localStorage.userId, ...finalParticipants],
          },
        });
        window.location.href = "/chat/g" + chat_id;
        setCreateButton("Create");
      }).then((err) => {
        if (err) {
          setCreateButton("Create");
          setPopupText(
            "Something went wrong when trying to create the group chat."
          );
          setShowPopup(true);
          console.log("create error");
        }
      });
    }
  };

  useEffect(() => {
    const searchTimeout = setTimeout(() => matchUsers(userQuery), 500);
    return () => clearTimeout(searchTimeout);
  }, [userQuery]);

  return (
    <>
      <AppHeader
        closeHandler={() => {
          window.location.href = "/chat";
        }}
        tabName="Create Group Chat"
      />

      <div className="chat-create-container">
        <StandardModal
          show={showPopup}
          type={"error"}
          text={popupText}
          onCloseAction={() => {
            setShowPopup(false);
          }}
          hasTransition
          hasIconAnimation
        />
        <div
          className="group-chat-img"
          style={{
            marginBottom: displayImageWarning !== "none" ? "0" : "30px",
          }}
        >
          <img
            src={
              "https://d22r54gnmuhwmk.cloudfront.net/rendr-fe/img/default-organization-logo-6aecc771.gif"
            }
            alt={"group chat"}
            id="profileImage_preview"
            onClick={() => {
              document.getElementById("profileImage_upload").click();
            }}
          />
          <input
            type="file"
            name="profile_image"
            id="profileImage_upload"
            onChange={changeImagePreview}
          />
        </div>
        <div
          className="file-size-warning"
          style={{ display: displayImageWarning }}
        >
          <p>{imageWarningText}</p>
        </div>
        <div className="group-name-input">
          <input
            type="text"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
            placeholder="New Group"
            maxLength={25}
          />
        </div>
        <div className="group-participants">
          <div className="user-search-bar">
            <h2>Participants</h2>
            <input
              type="text"
              className="user-search"
              value={userQuery}
              onChange={(e) => {
                setUserQuery(e.target.value);
              }}
              placeholder="Search by Name"
            />
            {suggestedUsers.length > 0 && (
              <ul className="suggested-users">
                {suggestedUsers.map((u) => {
                  return (
                    <li
                      key={u.id}
                      onClick={() => {
                        setParticipants([...participants, u]);
                        if (suggestedUsers.indexOf(u) > -1)
                          suggestedUsers.splice(suggestedUsers.indexOf(u), 1);
                      }}
                    >
                      {u.user_name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="participant-table">
            <table>
              <tbody>
                {participants.length > 0 ? (
                  participants.map((p) => {
                    return (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={
                              p.profile_image !== null
                                ? p.profile_image
                                : "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                            }
                            alt={"participant profile"}
                          />
                        </td>
                        <td>{p.user_name}</td>
                        <td>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                            onClick={() => {
                              setParticipants(
                                participants.filter((u) => u.id !== p.id)
                              );
                            }}
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>
                      <img
                        src={
                          "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                        }
                        alt={"participant profile"}
                      />
                    </td>
                    <td>No participants</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button
          type="button"
          className="chat-create"
          onClick={() => {
            createChat();
          }}
        >
          {createButton}
        </button>
      </div>
    </>
  );
}
