import axios from "axios";

const USER_CACHE = "eduapp_user";

export const saveUserOffline = async (userInfo) => {
  delete userInfo.profile_image;

  localStorage.setItem("offline_user", JSON.stringify(userInfo));
};

export const cacheProfileImage = async (imgUrl) => {
  let cache = await caches.open(USER_CACHE);

  let entries = await cache.keys();

  for (let c of entries) {
    if (c.url.includes("rails/active_storage")) cache.delete(c);
  }

  let imgBlob = await axios.get(imgUrl, { responseType: "blob" });
  console.log(URL.createObjectURL(imgBlob.data));
  //await cache.add(URL.createObjectURL(imgBlob.data));

  return true;
};

export const getImageFromCache = async () => {
  let cache = await caches.open(USER_CACHE);

  let entries = await cache.keys();

  let img = null;
  for (let c of entries) {
    if (c.url.includes("rails/active_storage")) img = c.url;
  }

  return img;
};

export const getOfflineUser = async () => {
  let user = JSON.parse(localStorage.getItem("offline_user"));

  user.profile_image = { url: await getImageFromCache() };

  return user;
};
