/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Toolbar from "../components/toolbar";
import Navbar from "../components/Navbar";
import Schedulesessionslist from "../components/schedulesessionslist";
import Scheduleeventslist from "../components/scheduleeventslist";
import InstitutionConfig from "../components/institutionConfig";
import CourseConfig from "../components/courseConfig";
import SubjectsConfig from "../components/subjectsConfig";
import UserConfig from "../components/userConfig";
import EnrollConfig from "../components/enrollConfig";
import EnrollSubjectConfig from "../components/enrollSubjectConfig";
import ChatConfig from "../components/ChatConfig";
import ChatParticipantConfig from "../components/ChatParticipantConfig";
import TeacherConfig from "../components/teacherConfig";
import ResourcesConfig from "../components/ResourcesConfig";
import UserRolesConfig from "../components/UserRolesConfig";
import "../styles/users.css";
import "../styles/controlPanel.css";

/**
 * Used to contain all components inside their respective locations.
 */
export default function ControlPanel() {
  const [location, setLocation] = useState(
    localStorage.getItem("eduapp_last_viewed")
  );

  const ComponentManager = () => {
    switch (location) {
      case "sessions":
        return <Schedulesessionslist />;
      case "events":
        return <Scheduleeventslist />;
      case "institutions":
        return <InstitutionConfig />;
      case "courses":
        return <CourseConfig />;
      case "subjects":
        return <SubjectsConfig />;
      case "users":
        return <UserConfig />;
      case "teachers":
        return <TeacherConfig />;
      case "chatConfig":
        return <ChatConfig />;
      case "chatParticipant":
        return <ChatParticipantConfig />;
      case "resources":
        return <ResourcesConfig />;
      case "enroll":
        return <EnrollConfig />;
      case "enroll_subjects":
        return <EnrollSubjectConfig />;
      case "userRoles":
        return <UserRolesConfig />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (localStorage.getItem("eduapp_last_viewed") === null) {
      localStorage.setItem("eduapp_last_viewed", "institutions");
      setLocation(localStorage.getItem("eduapp_last_viewed"));
    }
  }, []);

  return (
    <div className="users-main-container">
      <Navbar locationState={[location, setLocation]} />
      <div className="main-section">
        <Toolbar location={location} />
        <div
          className={`controlPanel-content-container ${location}`}
          id="controlPanelContentContainer"
        >
          <ComponentManager />
        </div>
      </div>
    </div>
  );
}
