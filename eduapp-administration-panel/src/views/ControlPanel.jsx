import React, { useState, useEffect } from "react";
import Toolbar from "../components/toolbar";
import Navbar from "../components/Navbar";
import Schedulesessionslist from "../components/schedulesessionslist";
import Scheduleeventslist from "../components/scheduleeventslist";
import InstitutionConfig from "../components/institutionConfig";
import CourseConfig from "../components/courseConfig";
import SubjectsConfig from "../components/subjectsConfig";
import UserConfig from "../components/userConfig";
import EnrollConfig from "../components/enrollConfig";
import ChatConfig from "../components/ChatConfig";
import ChatMessageConfig from "../components/ChatMessageConfig";
import ChatParticipantConfig from "../components/ChatParticipantConfig";
import TeacherConfig from "../components/teacherConfig";
import LANGUAGES from "../constants/languages";
import ResourcesConfig from "../components/ResourcesConfig";
import UserRolesConfig from "../components/UserRolesConfig";
import "../styles/users.css";
import "../styles/controlPanel.css";

export default function ControlPanel() {
  const [location, setLocation] = useState("sessions");
  const [language, setLanguage] = useState("en");

  const changeToolbarLocation = (incoming) => setLocation(incoming);

  const switchLanguage = (language) => {
    switch (language) {
      case "es":
        setLanguage(LANGUAGES.es);
        break;
      case "pt":
        setLanguage(LANGUAGES.pt);
        break;
      default:
        setLanguage(LANGUAGES.en);
        break;
    }
  };

  return (
    <div className="users-main-container">
      <Navbar
        toolbarLocation={changeToolbarLocation}
        switchLanguage={switchLanguage}
        location={location}
        language={language}
      />
      <div className="main-section">
        <Toolbar location={location} language={language} />
        <div
          className="controlPanel-content-container"
          id="controlPanelContentContainer"
        >
          {location === "sessions" ? (
            <Schedulesessionslist language={language} />
          ) : location === "events" ? (
            <Scheduleeventslist language={language} />
          ) : location === "institutions" ? (
            <InstitutionConfig language={language} />
          ) : location === "courses" ? (
            <CourseConfig language={language} />
          ) : location === "subjects" ? (
            <SubjectsConfig language={language} />
          ) : location === "users" ? (
            <UserConfig language={language} />
          ) : location === "enroll" ? (
            <EnrollConfig language={language} />
          ) : location === "teachers" ? (
            <TeacherConfig language={language} />
          ) : location === "chatConfig" ? (
            <ChatConfig language={language} />
          ) : location === "chatMessage" ? (
            <ChatMessageConfig language={language} />
          ) : location === "chatParticipant" ? (
            <ChatParticipantConfig language={language} />
          ) : location === "resources" ? (
            <ResourcesConfig language={language} />
          ) : location === "userRoles" ? (
            <UserRolesConfig language={language} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
