import React from "react";
import MenuHeader from "../menuHeader/MenuHeader";
import "./MenuSettings.css";
export default function MenuSettings() {
  const closeMenuSettings = () => {
    console.log("close");
    document
      .getElementsByClassName("MenuSettings__main-container")[0]
      .classList.add("MenuSettings__hidden");
  };
  return (
    <div className={"MenuSettings__main-container MenuSettings__hidden"}>
      <MenuHeader
        backTo={() => {
          closeMenuSettings();
        }}
        backToName={"Settings"}
      />

      <ul>
        <li>LANGUAGE</li>
        <li>DARK MODE</li>
      </ul>
    </div>
  );
}
