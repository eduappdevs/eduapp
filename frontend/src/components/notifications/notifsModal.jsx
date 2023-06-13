import getPrefixedImageURL from "../../utils/UrlImagePrefixer";
import { IMG_FLBK_USER } from "../../config";
/**
 * Creates a notification with data to display
 * at the top of the app on mobile.
 */
const instanceModal = (data) => {
  const root = document.getElementById("root");
  const container = document.createElement("div");

  container.classList.add("notifs_container");
  const left = document.createElement("div");
  left.classList.add("notifs_left");
  const profile_pic = document.createElement("img");

  if (data.author_pic && data.author_pic.url) {
    profile_pic.src = getPrefixedImageURL(data.author_pic.url);
  } else {
    profile_pic.src = IMG_FLBK_USER;
  }


  profile_pic.classList.add("notifs_profile_pic");
  left.appendChild(profile_pic);

  const author_name = document.createElement("span");
  author_name.innerHTML = data.author_name;
  author_name.classList.add("notifs_author_name");

  const right = document.createElement("div");
  right.classList.add("notifs_right");
  const message = document.createElement("span");
  message.classList.add("notifs_message");
  message.innerHTML = data.msg.message;

  right.appendChild(author_name);
  right.appendChild(message);

  const closeButton = document.createElement("div");
  closeButton.classList.add("close_notif");
  closeButton.innerHTML = "x";
  closeButton.onclick = () => {
    container.classList.add("removeSlideUP");
    setTimeout(() => {
      container.remove();
    }, 400);
  };

  left.onclick = () => {
    window.location.href = data.chat_url;
  };
  right.onclick = () => {
    window.location.href = data.chat_url;
  };

  container.appendChild(left);
  container.appendChild(right);
  container.appendChild(closeButton);
  root.appendChild(container);

  let second_timeout;
  const first_timeout = setTimeout(() => {
    if (container) {
      container.classList.add("removeSlideUP");
      second_timeout = setTimeout(() => {
        container.remove();
      }, 400);
    }
  }, 8000);

  // useEffect(() => {
  //   return () => {
  //     if (first_timeout) clearTimeout(first_timeout);
  //     if (second_timeout) clearTimeout(second_timeout);
  //   }
  // }, [])
};

export { instanceModal };
