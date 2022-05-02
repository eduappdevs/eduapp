import { useState, useEffect } from "react";
import API from "../API";
import { getOfflineUser, saveUserOffline } from "../utils/OfflineManager";

export const FetchUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (navigator.onLine) {
        try {
          let userInfo = await API.fetchInfo(userId);
          userInfo =
            userInfo.length > 0 ? userInfo[0] : { error: "User not found" };
          delete userInfo.googleid;
          setUserInfo({ ...userInfo });
          await saveUserOffline(userInfo);
        } catch (error) {
          if (error.message.includes("(reading 'protocol')"))
            console.warn("No user logged in.");
          else console.error(error);
        }
      } else {
        let offlineUser = await getOfflineUser();
        setUserInfo({ ...offlineUser });
      }
    };

    fetchUserInfo();
  }, [userId]);

  return userInfo;
};
