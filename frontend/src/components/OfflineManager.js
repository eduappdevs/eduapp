import axios from "axios";
import MediaFix from "./MediaFixer";

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const saveUserOffline = async (userInfo) => {
  if (userInfo.profile_image.url !== undefined) {
    let imgBlob = await axios.get(MediaFix(userInfo.profile_image.url), {
      responseType: "blob",
    });
    let img64 = await blobToBase64(imgBlob.data);

    userInfo.profile_image = { url: img64 };
  }

  localStorage.setItem("offline_user", JSON.stringify(userInfo));
};

export const updateUserImageOffline = async (newImgUrl) => {
  let user = getOfflineUser();
  user.profile_image.url = newImgUrl;

  await saveUserOffline(user);
};

export const getOfflineUser = () => {
  let user = JSON.parse(localStorage.getItem("offline_user"));

  return user;
};
