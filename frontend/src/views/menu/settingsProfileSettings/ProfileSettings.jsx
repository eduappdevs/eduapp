import React from "react";
import "./ProfileSettings.css";
import MenuHeader from "../menuHeader/MenuHeader";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { useState } from "react/cjs/react.development";
export default function ProfileSettings() {
  const { state: userInfo } = FetchUserInfo(localStorage.userId);
  const [userName, setUserName] = useState("");
  const [userProfileImg, setProfileImg] = useState("");

  const closeProfileSettings = () => {
    document
      .getElementsByClassName("profileSettings_container")[0]
      .classList.add("profileSettings__hidden");
  };
  return (
    <div className="profileSettings_container profileSettings__hidden">
      <MenuHeader
        backTo={() => {
          closeProfileSettings();
        }}
        backToName={"Settings"}
      />
      <div className="profileSettings_wrapper">
        <input
          type="file"
          name="profile_image"
          id="profileSettings_profile_image"
        />
        <img
          src={userProfileImg}
          alt={"user"}
          className="profileSettings_profileimg"
        />

        <input type="text" defaultValue={userName} />
      </div>
    </div>
  );
}
