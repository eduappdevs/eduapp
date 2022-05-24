import axios from "axios";
import * as AUTH_SERVICE from "../services/auth.service";

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const saveUserOffline = async (userInfo) => {
  if (userInfo.profile_image !== null) {
    let imgBlob = await axios.get(userInfo.profile_image, {
      responseType: "blob",
    });
    let img64 = await blobToBase64(imgBlob.data);

    userInfo.profile_image = img64;
  }

  if (userInfo.googleid !== undefined) delete userInfo.googleid;
  localStorage.setItem("offline_user", JSON.stringify(userInfo));
};

export const updateUserImageOffline = async (newImgUrl) => {
  let user = getOfflineUser();
  user.profile_image = newImgUrl;

  await saveUserOffline(user);
};

export const getOfflineUser = () => {
  let user = JSON.parse(localStorage.getItem("offline_user"));

  if (user === null) {
    user = {
      user: null,
      profile_image: null,
      id: null,
      user_name: null,
      token: null,
    };
  }

  return user;
};

export const interceptExpiredToken = async (error) => {
  if (
    error.message.includes("428") ||
    error.message.includes("406") ||
    error.message.includes("403")
  ) {
    await AUTH_SERVICE.logout();
    window.location.reload();
  }
};
