/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import ChatBubble from "./chatBubbles/ChatBubble";
import AppHeader from "../../../components/appHeader/AppHeader";
import ChatsAC from "../../../utils/websockets/actioncable/ChatsAC";
import NotifsAC from "../../../utils/websockets/actioncable/NotifsAC";
import { asynchronizeRequest } from "../../../API";
import * as USER_SERVICE from "../../../services/user.service";
import * as CHAT_SERVICE from "../../../services/chat.service";
import {
  getOfflineUser,
  interceptExpiredToken,
} from "../../../utils/OfflineManager";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import EncryptionUtils from "../../../utils/EncryptionUtils";
import useViewsPermissions from "../../../hooks/useViewsPermissions";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import useLanguage from "../../../hooks/useLanguage";
import { MainChatInfoCtx } from "../../../hooks/MainChatInfoContext";
import { useNavigate, useParams } from "react-router-dom";
import { IMG_FLBK_GROUP, IMG_FLBK_USER } from "../../../config";
import getPrefixedImageURL from "../../../utils/UrlImagePrefixer";

import "./MainChat.css";
import IDBManager from "../../../utils/IDBManager";
import { ChatBottomCtx } from "../../../hooks/ChatBottomContext";

const acInstance = new ChatsAC();
const notifs = new NotifsAC();
let privKey = null;
let pubKey = null;
let db = new IDBManager();

export default function MainChat() {
  const [chatBottomParams, setChatBottomParams] = useContext(ChatBottomCtx);
  const { chatId } = useParams();

  const language = useLanguage();
  // eslint-disable-next-line no-unused-vars
  const [_, setChatCtx] = useContext(MainChatInfoCtx);
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [chat, setChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [readOnly, setReadOnly] = useState(false);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [isPopupQuestion, setIsPopupQuestion] = useState(false);

  const thisUser = getOfflineUser();

  const sendMessage = async () => {
    const inputMsgEl = document.getElementById("message-area");
    const inputMsg = inputMsgEl.value.trim();
    if (
      inputMsg !== "" &&
      inputMsg !== " " &&
      inputMsg.length > 0
    ) {
      const userId = thisUser.user.id;
      const msgEncrypted = EncryptionUtils.encrypt(inputMsg, pubKey);
      const msgDate = new Date()

      if (acInstance.sendChannelCmd()) {
        acInstance.sendChannelCmd(
          "message",
          msgEncrypted,
          userId,
          msgDate.toISOString()
        );

        const msgToSave = {
          id: "newMessage" + new Date().toJSON(),
          decryptedMessage: inputMsg,
          user: {
            id: userId,
            user_info: {
              user_name: thisUser.user_name
            }
          },
          chat_base: {
            id: chatId.substring(1),
            isGroup: false
          },
          send_date: msgDate.toJSON()
        }

        await db.set(msgToSave.id, msgToSave);

        notifs.sendChannelCmd(`${userId}:${msgEncrypted}`, {
          type: "notification",
          to: {
            userId,
          },
        });

        document.getElementById("message-area").value = "";
      } else {
        console.log("Error sending message")
      }


      // To test notifications focus...
      // inputMsgEl.value = "";
      // setTimeout(() => {
      //   acInstance.sendChannelCmd(
      //     "message",
      //     EncryptionUtils.encrypt(inputMsg, pubKey),
      //     thisUser.user.id,
      //     new Date().toISOString()
      //   );
      //   notifs.sendChannelCmd(`${userId}:${msgEncrypted}`, {
      //     type: "notification",
      //     to: {
      //       userId,
      //     },
      //   });
      //   inputMsgEl.value = "";
      // },10000);
    }
  };

  const manageIncomingMsg = async (newMsg) => {
    if (newMsg.chat_base.id === acInstance.chatCode.substring(1)) {
      decryptMessages([newMsg]).then((messagesReadyToShow) => {
        if (newMsg.user.id !== thisUser.user.id) {
          setMessagesToIDB(messagesReadyToShow);
        }
        setNewMessages((prevMsgs) => [...prevMsgs, messagesReadyToShow[0]]);
        let messageBox = document.getElementsByClassName(
          "main-chat-messages-container"
        )[0];
        if (messageBox.childNodes.length !== 0) {
          messageBox.childNodes[
            messageBox.childNodes.length - 1
          ].scrollIntoView();
        }
      });
    }
  };

  const showLeaveChatDialog = () => {
    setPopupText(language.chat_want_leave);
    setIsPopupQuestion(true);
    setPopup(true);
    manageExtrasMenu();
  };

  const leaveChat = async () => {
    asynchronizeRequest(async () => {
      try {
        await CHAT_SERVICE.removeParticipant(
          thisUser.user.id,
          chat.chatInfo.id
        );
        window.location.href = "/chat";
      } catch (err) {
        await interceptExpiredToken(err);
      }
    }).then((err) => {
      if (err) console.log("connection error");
    });
  };

  const findUserName = (uId) => {
    if (chat.chatParticipants.length === undefined) return ""; //To be fixed: logged out user. It should be maybe fetched in the server.
    let messageSender = chat.chatParticipants.find((u) => u.user.id === uId);
    if (messageSender === undefined) return ""; //To be fixed: logged out user. It should be maybe fetched in the server.
    return messageSender.user_name;
  };

  const manageExtrasMenu = () => {
    let extras = document.getElementById("main-chat-extras").classList;
    let extrasList = document.getElementById("main-chat-extras-list").classList;

    if (extras.contains("main-chat-info-menu-hide")) {
      extras.remove("main-chat-info-menu-hide");
      extrasList.remove("main-chat-info-list-hide");
      extras.add("main-chat-info-menu-show");
      extrasList.add("main-chat-info-list-show");
    } else {
      extras.remove("main-chat-info-menu-show");
      extrasList.remove("main-chat-info-list-show");
      extrasList.add("main-chat-info-list-hide");
      extras.add("main-chat-info-menu-hide");
    }
  };

  const manageChatView = () => {
    setTimeout(() => {
      let messageBox = document.getElementsByClassName(
        "main-chat-messages-container"
      )[0];
      if (messageBox.childNodes.length !== 0) {
        messageBox.childNodes[
          messageBox.childNodes.length - 1
        ].scrollIntoView(true);
      }

      setChatCtx(chat);
      window.dispatchEvent(new Event("canLoadChat"));
    }, 100);
  }

  const setMessagesToIDB = async (messagesToIDB) => {
    await db.getStorageInstance("eduapp-messages-db", "messages");
    messagesToIDB.map(async m => {
      await db.set(m.id, m)
    });
  }

  const decryptMessages = async (messagesToDecrypt) => {
    let auxMessages = []
    messagesToDecrypt.map(m => {
      auxMessages.push({
        id: m.id,
        decryptedMessage: EncryptionUtils.decrypt(m.message, privKey).message,
        user: {
          id: m.user.id,
          user_info: {
            user_name: m.user.user_info && m.user.user_info.user_name ?
              m.user.user_info.user_name : ""
          }
        },
        chat_base: {
          id: m.chat_base.id,
          isGroup: m.chat_base.isGroup
        },
        send_date: m.send_date
      });
    });
    return auxMessages;
  }

  useViewsPermissions(FetchUserInfo(thisUser.user.id), "chat");

  useEffect(() => {
    acInstance.chatCode = chatId;
    let filtered_chatId = chatId.substring(1)

    // Generate websocket connection to chat room
    acInstance.generateChannelConnection(acInstance.chatCode).then(async () => {
      // Retrieve chat info
      await asynchronizeRequest(async function () {
        let rawChat = (await CHAT_SERVICE.fetchChatInfo(filtered_chatId)).data;
        let cInfo = rawChat.chat;
        let participants = rawChat.participants;

        privKey = atob(cInfo.private_key);
        pubKey = atob(cInfo.public_key);
        setReadOnly(cInfo.isReadOnly);

        if (cInfo.chat_name.includes("private_chat_")) {
          participants = participants.find(
            (u) => u.user.id !== thisUser.user.id
          );
          cInfo.image =
            participants.profile_image !== null
              ? participants.profile_image
              : undefined;
          cInfo.chat_name = participants.user_name;
        }
        setChat({ ...chat, chatInfo: cInfo, chatParticipants: participants });
      });
      // Retrieve chat messages
      await db.getStorageInstance("eduapp-messages-db", "messages");

      db.isEmpty().then((res) => {
        if (res) {
          CHAT_SERVICE.fetchChatMessages(filtered_chatId).then(async (msgs) => {
            const messagesReadyToShow = await decryptMessages(msgs.data);
            setMessages(messagesReadyToShow);
            await setMessagesToIDB(messagesReadyToShow);
            manageChatView();
          });
        } else {
          db.getAllValues().then((values) => {
            let msgsToList = [];
            values.map((value) => {
              if (value.chat_base.id === filtered_chatId) {
                msgsToList = [value, ...msgsToList];
              }
            })

            if (msgsToList.length === 0) {
              CHAT_SERVICE.fetchChatMessages(filtered_chatId).then(async (msgs) => {
                const messagesReadyToShow = await decryptMessages(msgs.data);
                setMessages(messagesReadyToShow);
                await setMessagesToIDB(messagesReadyToShow);
                manageChatView();
              });
              return;
            }

            msgsToList.sort((a, b) => new Date(a.send_date) - new Date(b.send_date))

            // Messages sent after last time saved to IndexedDB.
            CHAT_SERVICE.fetchChatMessages(filtered_chatId,
              msgsToList.slice(-1)[0].send_date).then(async (msgs) => {
                const messagesReadyToShow = await decryptMessages(msgs.data);
                msgsToList = msgsToList.concat(messagesReadyToShow);
                setMessages(msgsToList);
                await setMessagesToIDB(messagesReadyToShow);
                manageChatView();
              });
          });
        }
      })
    });
  }, []);

  useEffect(() => {
    document.addEventListener("new_msg", async (e) => {
      e.stopImmediatePropagation();
      // if(!e.detail.user.user_info){
      //   const userInfo = (await USER_SERVICE.findById(e.detail.user.id)).data;
      //   e.detail.user = {...e.detail.user, user_info: userInfo[0].user.user_info }
      // }
      manageIncomingMsg(e.detail);
    });

    let inputArea = document.getElementById("message-area");
    inputArea.onkeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (inputArea.value.length !== 0) sendMessage();
      }
    };
  }, [newMessages, acInstance]);

  useEffect(() => {
    setPopupText(language.wip);
  }, [language]);

  useEffect(() => {
    setChatBottomParams({ showing: true });

    return () => {
      setChatBottomParams({ showing: false });
    };
  }, []);

  return (
    <>
      <div className="main-chat-container">
        <AppHeader
          type="main-chat"
          chatName={chat.chatInfo ? chat.chatInfo.chat_name : ""}
          closeHandler={() => {
            acInstance.closeConnection();
            window.location.href = "/chat";
          }}
          extrasHandler={() => manageExtrasMenu()}
          openChatInfo={() => {
            manageExtrasMenu();
            setTimeout(
              () => navigate("/chat/info/" + acInstance.chatCode),
              200
            );
          }}
          language={language}
          imageNameClick={() =>
            setTimeout(() => navigate("/chat/info/" + acInstance.chatCode), 200)
          }
          leaveChat={() => showLeaveChatDialog()}
          chatImage={
            chat.chatInfo?.image?.url
              ? getPrefixedImageURL(chat.chatInfo.image.url)
              : chat.chatInfo?.isGroup
                ? IMG_FLBK_GROUP
                : IMG_FLBK_USER
          }
        />

        <StandardModal
          show={showPopup}
          type={"warning"}
          text={popupText}
          iconFill
          hasIconAnimation
          hasTransition
          isQuestion={isPopupQuestion}
          onYesAction={() => leaveChat()}
          onNoAction={() => {
            setPopup(false);
            setPopupText(language.wip);
            setIsPopupQuestion(false);
          }}
          onCloseAction={() => setPopup(false)}
        />

        <div className="main-chat-messages-container">
          {messages.length !== 0
            ? messages.map((msg) => {
              // addLocalMessage(msg);
              return (
                <ChatBubble
                  key={msg.user.id + "-" + msg.id}
                  message={msg.decryptedMessage
                    // EncryptionUtils.decrypt(msg.message, privKey).message
                  }
                  foreign={
                    // eslint-disable-next-line eqeqeq
                    thisUser.user && msg.user && msg.user.id && (msg.user.id !== thisUser.user.id) ? true : false
                  }
                  isGroup={msg.chat_base.isGroup}
                  // author={findUserName(msg.user.id)}
                  author={msg.user.user_info && msg.user.user_info.user_name ?
                    msg.user.user_info.user_name : findUserName(msg.user.id)
                  }
                  isMsgRecent={false}
                />
              );
            })
            : null}
          {newMessages.length !== 0
            ? newMessages.map((msg) => {
              return (
                <ChatBubble
                  key={msg.user.id + "-" + msg.id}
                  message={msg.decryptedMessage
                    // EncryptionUtils.decrypt(msg.message, privKey).message
                  }
                  foreign={
                    // eslint-disable-next-line eqeqeq
                    msg.user.id !== thisUser.user.id ? true : false
                  }
                  isGroup={msg.chat_base.isGroup}
                  // author={findUserName(msg.user.id)}
                  author={msg.user.user_info && msg.user.user_info.user_name ?
                    msg.user.user_info.user_name : findUserName(msg.user.id)
                  }
                  isMsgRecent={true}
                />
              );
            })
            : null}
        </div>

        <div className="main-chat-input-container">
          <div className="main-chat-attachment-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="grey"
              className="bi bi-paperclip"
              viewBox="0 0 16 16"
              onClick={() => {
                setPopup(true);
              }}
            >
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
            </svg>
          </div>
          <div className="main-chat-input-text">
            <textarea
              id="message-area"
              disabled={readOnly}
              placeholder={readOnly ? "This chat was created by the system." : undefined}
            />
          </div>
          <div className="main-chat-send-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send"
              viewBox="2 -5 15 23"
              onClick={sendMessage}
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
