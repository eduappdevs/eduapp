import React from "react";
import { Button, Popconfirm } from "antd";
import "../../views/resources/openedResource/OpenedResource.css";
import "./headerStyles/ChatHeader.css";
import "./headerStyles/DefaultHeader.css";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import { getOfflineUser } from "../../utils/OfflineManager";
import userCan, { DELETE, RESOURCE, UPDATE } from "../../hooks/userCan";

/**
 *
 * The app's main header component.
 *
 * @param {String} type The type of header that is going to be used
 * @param {Function} closeHandler Funtion to execute when the header wants to close
 * @param {Boolean} canAction Resources: defines it can delete or not
 * @param {String} resourceName Resources: the resource's name
 * @param {Function} editResource Resources: function to execute when it wants to edit
 * @param {Function} deleteResource Resources: function to execute when it wants to delete
 * @param {String} chatImage Chat: the chat's image
 * @param {String} chatName Chat: the chat's name
 * @param {Function} extrasHandler Chat: function to open the chat options
 * @param {String} tabName The header's title
 * @param {Function} leaveChat Chat: Function to leave chat
 * @param {Function} openChatInfo Chat: Opens the chat information
 * @param {Function} imageNameClick Chat: Function to do something on image click
 * @param {Object} language The header's title
 */
export default function AppHeader({
  type,
  closeHandler,
  canAction,
  resourceName,
  editResource,
  deleteResource,
  chatImage,
  chatName,
  extrasHandler,
  tabName,
  leaveChat,
  openChatInfo,
  imageNameClick,
  language,
}) {
  switch (type) {
    case "resource":
      let userInfo = FetchUserInfo(getOfflineUser().user.id);
      let canUpdateRs = userInfo && userCan(userInfo, RESOURCE, UPDATE);
      let canDeleteRs = userInfo && userCan(userInfo, RESOURCE, DELETE);

      return (
        <div className="resourceOpened__header">
          <div className="resourceOpened__backToResources">
            <div
              className="resourceOpened__backToResources__container"
              onClick={() => {
                closeHandler();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-left-fill"
                viewBox="0 0 16 16"
              >
                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
            </div>
          </div>
          <div className="resourceOpened__name">
            <h1>{resourceName}</h1>
          </div>
          {canAction && (
            <div className="resourceOpened__buttons">
              {/* UNCOMMENT TO HAVE EDIT BUTTON. NOW IT'S USELESS 
              
                {canUpdateRs && (
                <div className="resources__editButton" onClick={editResource}>
                  {window.matchMedia("(max-width: 1100px)").matches ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
                    </svg>
                  ) : (
                    "Edit this"
                  )}
                </div>
              )} */}
              {canDeleteRs && (
                <Popconfirm
                  placement="bottomRight"
                  title={language.delete}
                  description={language.delete_confirm}
                  onConfirm={deleteResource}
                  okText={language.modal_yes}
                  cancelText={language.modal_no}
                >
                  {/* <Button>{language.delete_this}</Button> */}
                  <Button>
                    {window.matchMedia("(max-width: 1100px)").matches ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                      </svg>
                    ) : (
                      "Delete this"
                    )}
                  </Button>
                </Popconfirm>
              )}
            </div>
          )}
        </div>
      );
    case "main-chat":
      return (
        <>
          <div className="ChatHeader">
            <div
              id="main-chat-extras"
              className="main-chat-info-menu main-chat-info-menu-hide"
            >
              <ul
                id="main-chat-extras-list"
                className="main-chat-info-list-hide"
              >
                <li onClick={() => openChatInfo()}>
                  {language.chat_information}
                </li>
                <hr />
                <li className="main-chat-leave" onClick={() => leaveChat()}>
                  {language.chat_leave}
                </li>
              </ul>
            </div>
            <div
              onClick={() => {
                closeHandler();
              }}
              className="ChatHeaderBack"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-left-fill"
                viewBox="0 0 16 16"
              >
                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
            </div>
            <div className="ChatHeaderName" onClick={() => imageNameClick()}>
              <img
                src={
                  chatImage
                    ? chatImage
                    : ""
                  // : "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                }
                alt="Chat Icon"
              />
              <p>{chatName}</p>
            </div>
            <div className="ChatHeaderOptions">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="black"
                className="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
                onClick={() => {
                  extrasHandler();
                }}
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </div>
          </div>
        </>
      );
    default:
      return (
        <div className="default-header">
          <div className="default-header-back-btn">
            <div
              className="default-header-back-btn-container"
              onClick={() => {
                closeHandler();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-left-fill"
                viewBox="0 0 16 16"
              >
                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
            </div>
          </div>
          <div className="default-tab-name">
            <h1>{tabName}</h1>
          </div>
        </div>
      );
  }
}
