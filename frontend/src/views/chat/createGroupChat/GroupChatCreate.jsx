/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { interceptExpiredToken } from "../../../utils/OfflineManager";
import AppHeader from "../../../components/appHeader/AppHeader";
import { asynchronizeRequest } from "../../../API.js";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import { getOfflineUser } from "../../../utils/OfflineManager";
import * as CHAT_SERVICE from "../../../services/chat.service";
import * as USER_SERVICE from "../../../services/user.service";
import * as SUBJECTSERVICE from "../../../services/subject.service";
import useViewsPermissions from "../../../hooks/useViewsPermissions";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import useRole from "../../../hooks/useRole";
import "./GroupChatCreate.css";
import useLanguage from "../../../hooks/useLanguage";

export default function GroupChatCreate() {
  const { subject_id } = useParams("");
  const navigate = useNavigate();
  const language = useLanguage();

  const [displayImageWarning, setWarnDisplay] = useState("none");
  const [changeImage, setChangeImage] = useState(null);
  const [imageWarningText, setWarningText] = useState(language.image_too_big);
  const [groupName, setGroupName] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [participants, setParticipants] = useState([]);
  const [subject, setSubject] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [createButton, setCreateButton] = useState(language.create);

  let canCreate = useRole(FetchUserInfo(getOfflineUser().user.id), [
    "eduapp-admin",
    "eduapp-teacher",
  ]);

  const fetchSubject = async () => {
    const subject = await SUBJECTSERVICE.fetchSubject(subject_id);
    setSubject(subject.data);
  };

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
        } else displayWarning(language.image_too_big);
      } else displayWarning(language.chat_no_image);
    } else displayWarning(language.file_not_image);
  };

  const matchUsers = (nameInput) => {
    if (nameInput.length > 0) {
      let currentParticipants = [];
      for (let p of participants) currentParticipants.push(p.user.id);

      asynchronizeRequest(async () => {
        let match = await USER_SERVICE.findByName(nameInput);

        let filteredUsers = [];
        for (let u of match.data) {
          if (
            currentParticipants.includes(u.user.id) ||
            u.user.id === getOfflineUser().user.id
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

  const createChat = async (e) => {
    if (groupName.length < 1) {
      setPopupText(language.chat_no_groupname);
      setShowPopup(true);
      return;
    }

    if (!subject?.users && participants.length < 2) {
      setPopupText(language.chat_group_min_2);
      setShowPopup(true);
      return;
    }

    if (createButton === language.create) {
      setCreateButton(language.creating);
      let finalParticipants = [];
      if (subject_id === "no-subject") {
        for (let p of participants) finalParticipants.push(p.user.id);
      } else {
        for (let user of subject.users) {
          if (getOfflineUser().user.id != user.id) {
            finalParticipants.push(user.id);
          }
        };
      }

      asynchronizeRequest(async () => {
        let chat_id = await CHAT_SERVICE.createCompleteChat({
          base: {
            chat_name: groupName,
            isGroup: true,
          },
          participants: {
            user_ids: [getOfflineUser().user.id, ...finalParticipants],
          },
        });
        if (subject_id !== "no-subject") {
          SUBJECTSERVICE.editSubject({
            id: subject_id,
            chat_link: chat_id,
          }).catch(async (error) => {
            if (error) {
              await interceptExpiredToken(e);
            }
          });
        }
        navigate("/chat/g" + chat_id);
        setCreateButton(language.create);
      }).then((err) => {
        if (err) {
          setCreateButton(language.create);
          setPopupText(language.chat_create_unknown);
          setShowPopup(true);
          console.log("create error");
        }
      });
    }
  };

  useViewsPermissions(FetchUserInfo(getOfflineUser().user.id), "chat");

  useEffect(() => {
    if (canCreate !== null) {
      if (!canCreate) window.location.href = "/chat";
      setCreateButton(language.create);
    }
    if (subject_id !== "no-subject") {
      fetchSubject();
    }
  }, [canCreate]);

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
        tabName={language.chat_title_group}
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
            placeholder={language.chat_new_group}
            maxLength={25}
          />
        </div>
        <div className="group-participants">
          <div className="user-search-bar">
            <h2>{language.chat_participants}</h2>
            {!subject?.users && (
              <>
                <input
                  type="text"
                  className="user-search"
                  value={userQuery}
                  onChange={(e) => {
                    setUserQuery(e.target.value);
                  }}
                  placeholder={language.chat_search_names}
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
                              suggestedUsers.splice(
                                suggestedUsers.indexOf(u),
                                1
                              );
                          }}
                        >
                          {u.user_name}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
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
                ) : subject?.users ? (
                  <>
                    {subject?.users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <img
                            src={
                              "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                            }
                            alt={"participant profile"}
                          />
                        </td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </>
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
                    <td>{language.chat_no_participants}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button
          type="button"
          className="chat-create"
          onClick={(e) => {
            createChat(e);
          }}
        >
          {createButton}
        </button>
      </div>
    </>
  );
}
