import { useState, useEffect } from "react";
import * as USER_SERVICE from "../services/user.service";
import { getOfflineUser, saveUserOffline } from "../utils/OfflineManager";

export const FetchUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (navigator.onLine || userId < 0) {
        try {
          let userInfo = await USER_SERVICE.findById(userId);

          userInfo = userInfo.data;
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
