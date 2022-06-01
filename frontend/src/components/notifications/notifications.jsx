<<<<<<< HEAD
import {incrementBadgeCount} from '../../App'

let unreadMessagesCount = 0;

function pushNotify(text) {
    if(!text) {
        console.log('xd')
        return false
    }

    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } 
    else if (Notification.permission === "granted") {
        var notify = new Notification('Eduapp!', {
            body: text,
        });

        incrementBadgeCount() 
    }
    // The user has previously denied or blocked the notifications. 
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                var notify = new Notification('Eduapp!', {
                    body: text,
                });
                incrementBadgeCount() 

            }


        });}
        else if (Notification.permission === "blocked") { 
        console.log("The user has blocked notifications");
    }
=======
import { incrementBadgeCount } from "../../App";
import EncryptionUtils from "../../utils/EncryptionUtils";

let unreadMessagesCount = 0;

export default function pushNotify(text, privateKey, image) {
  if (!text) {
    return false;
  }

  if (navigator.userAgent.includes("Macintosh") && !("PushManager" in window))
    return console.warn("Safari does not support desktop notification");

  if (!("Notification" in window))
    return console.warn("This browser does not support desktop notification");

  switch (Notification.permission) {
    case "granted":
      console.log("granted");
      var notify = new Notification("EduApp", {
        body: text,
      });
      notify.onshow = () => console.log("SHOWN");
      incrementBadgeCount();
      break;
    case "denied":
    case "default":
      console.log("default");
      window.Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          var notify = new Notification("EduApp", {
            body: text,
          });
          notify.onshow = () => console.log("SHOWN");
          incrementBadgeCount();
        }
      });
      break;
    default:
      console.warn("The user has blocked notifications for EduApp.");
      break;
  }
>>>>>>> b64257ef013cdb2d174dae1a0c05e34be878e42c
}

// Badge
async function instanceBadge() {
  try {
    if (navigator)
      navigator
        .setClientBadge(unreadMessagesCount)
        .setAppBadge(unreadMessagesCount);
  } catch (err) {
    console.error("Badge instance error", err);
  }
}
async function resetBadge() {
  await navigator.setAppBadge(0);
  unreadMessagesCount = 0;
}

export { instanceBadge, resetBadge };
