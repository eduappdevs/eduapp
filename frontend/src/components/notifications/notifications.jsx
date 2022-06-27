import { incrementBadgeCount } from "../../App";
let unreadMessagesCount = 0;

export default function pushNotify(text, image, name) {
  if (!text) {
    return false;
  }

  if (navigator.userAgent.includes("Macintosh") && !("PushManager" in window))
    return console.warn("Safari does not support desktop notification");

  if (!("Notification" in window))
    return console.warn("This browser does not support desktop notification");

  switch (Notification.permission) {
    case "granted":
      var notify = new Notification("EduApp", {
        body: `${name}: ${text}`,
        image: image,
      });
      incrementBadgeCount();
      break;
    case "denied":
    case "default":
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
