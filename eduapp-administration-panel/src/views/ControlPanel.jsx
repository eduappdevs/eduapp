import React, { useState, useEffect } from "react";
import Toolbar from "../components/toolbar";
import Navbar from "../components/Navbar";
import "../styles/users.css";
import "../styles/controlPanel.css";
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
import * as SUBJECTSERVICE from "../services/subject.service";

import * as API from "../API";

export default function ControlPanel() {
  const [location, setLocation] = useState("sessions");
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);

  const changeToolbarLocation = (incoming) => {
    console.log("click", incoming);
    setLocation(incoming);
  };
  const [subjects, setSubjects] = useState([]);
  const fetchSubject = () => {
    API.asynchronizeRequest(function () {
      SUBJECTSERVICE.fetchSubjects().then((i) => {
        setSubjects(i.data);
      });
    });
  };
  useEffect(() => {
    fetchSubject();
  }, []);

  const searchFilter = (search) => {
    setSearch(search);
  };
  const userRoleFilter = (role) => {
    console.log(role);
    console.log(role === "ADMIN" ? 1 : role === "STUDENT" ? 0 : null);
    setUserRole(role === "ADMIN" ? 1 : role === "STUDENT" ? 0 : null);
  };

  return (
    <div className="users-main-container">
      <Navbar toolbarLocation={changeToolbarLocation} />
      <div>
        <Toolbar
          location={location}
          search={searchFilter}
          userRole={userRoleFilter}
          subjects={subjects}
        />
        <div className="controlPanel-content-container">
          {location === "sessions" ? (
            <Schedulesessionslist />
          ) : location === "events" ? (
            <Scheduleeventslist />
          ) : location === "institutions" ? (
            <InstitutionConfig />
          ) : location === "courses" ? (
            <CourseConfig />
          ) : location === "subjects" ? (
            <SubjectsConfig />
          ) : location === "users" ? (
            <UserConfig search={search} userRole={userRole} />
          ) : location === "enroll" ? (
            <EnrollConfig />
          ) : location === "chatConfig" ? (
            <>
              <ChatConfig />
            </>
          ) : location === "chatMessage" ? (
            <>
              <ChatMessageConfig />
            </>
          ) : location === "chatParticipant" ? (
            <>
              <ChatParticipantConfig />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
