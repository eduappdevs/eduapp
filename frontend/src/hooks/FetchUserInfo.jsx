import { useState, useEffect } from "react";
import API from "../API";
import { getOfflineUser, saveUserOffline } from "../components/OfflineManager";

export const FetchUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (navigator.onLine) {
        try {
          const userInfo = await API.fetchInfo(userId);
          setUserInfo({ ...userInfo });
          await saveUserOffline(userInfo);
        } catch (error) {
          console.log(error);
        }
      } else {
        let offlineUser = await getOfflineUser();
        setUserInfo({ ...offlineUser });
        console.log("OFFLINE USER: ", offlineUser);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return userInfo;
};
