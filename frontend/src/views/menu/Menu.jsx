/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import MenuSettings from "./menu-settings/MenuSettings";
import MenuHeader from "./menuHeader/MenuHeader";
import API from "../../API";
import ProfileSettings from "./profileOptions/ProfileSettings";
// import jsreport from "@jsreport/browser-client";
// import axios from "axios";

export default function Menu(props) {
  const openMenuSettings = () => {
    document
      .getElementsByClassName("MenuSettings__main-container")[0]
      .classList.remove("MenuSettings__hidden");
  };

  const openProfileSettings = () => {
    document
      .getElementsByClassName("profileSettings_container")[0]
      .classList.remove("profileSettings__hidden");
  };

  // const generateResourcesReport = async () => {
  //   const data = await API.fetchResources();

  //   let counts = [];
  //   let labels = [];
  //   for (let res of data) {
  //     if (!labels.includes(res.createdBy)) {
  //       labels.push(res.createdBy);
  //       counts.push(1);
  //     } else {
  //       counts[labels.indexOf(res.createdBy)] += 1;
  //     }
  //   }

  //   const payload = {
  //     data: {
  //       resources: data,
  //       chart_values: counts,
  //       chart_labels: labels,
  //     },
  //   };

  //   jsreport.serverUrl = "http://localhost:5488";
  //   const report = await jsreport.render({
  //     template: {
  //       name: "ResourcesReport",
  //     },
  //     data: JSON.stringify(payload),
  //   });

  //   report.openInWindow({ title: "Resources Report" });
  // };

  // const generateMessagesReport = async () => {
  //   const data = await axios.get("http://localhost:3000/chat_messages");

  //   let dates = [];
  //   let dateCounts = [];
  //   for (let msg of data.data) {
  //     let ftDate = msg.send_date.split("T")[0];
  //     if (!dates.includes(ftDate)) {
  //       dates.push(ftDate);
  //       dateCounts.push(1);
  //     } else {
  //       dateCounts[dates.indexOf(ftDate)] += 1;
  //     }
  //   }

  //   const payload = {
  //     data: {
  //       chart_values: dateCounts,
  //       chart_labels: dates,
  //     },
  //   };

  //   jsreport.serverUrl = "http://localhost:5488";
  //   const report = await jsreport.render({
  //     template: {
  //       name: "ChatMessagesReport",
  //     },
  //     data: JSON.stringify(payload),
  //   });

  //   report.openInWindow({ title: "Chat Messages Report" });
  // };

  // const generateCoursesReport = async () => {
  //   const data = await axios.get("http://localhost:3000/courses");

  //   const payload = {
  //     data: data.data,
  //   };
  //   console.log(payload);

  //   jsreport.serverUrl = "http://localhost:5488";
  //   const report = await jsreport.render({
  //     template: {
  //       name: "RegisteredCoursesReport",
  //     },
  //     data: JSON.stringify(payload),
  //   });

  //   report.openInWindow({ title: "Registered Courses Report" });
  // };
  // To be moved to admin panel

  return (
    <div
      className={
        window.matchMedia("(max-width:1100px)").matches
          ? "profile-menu-mobile"
          : "profile-menu-desktop"
      }
    >
      <MenuHeader
        backTo={() => {
          props.handleCloseMenu();
        }}
        location={"MENU"}
      />
      <ul style={{ height: "80%" }}>
        <li>
          <a
            onClick={() => {
              openProfileSettings();
            }}
          >
            PROFILE
          </a>
          <ProfileSettings />
        </li>
        <li>
          <a
            onClick={() => {
              openMenuSettings();
            }}
          >
            Settings
          </a>
          <MenuSettings />
        </li>
        <li>
          <a
            onClick={(event) => {
              event.preventDefault();
              window.location.href = "http://localhost:3003";
            }}
          >
            Help
          </a>
        </li>
        {/* <li>
          <a
            onClick={() => {
              generateMessagesReport();
            }}
          >
            Report
          </a>
        </li> */}
        <li>
          <a onClick={API.logout}>Log out</a>
        </li>
      </ul>
    </div>
  );
}
