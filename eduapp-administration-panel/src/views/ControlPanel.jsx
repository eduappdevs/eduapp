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
import "../styles/controlPanel.css";
import ChatConfig from "../components/ChatConfig";
import ChatMessageConfig from "../components/ChatMessageConfig";
import ChatParticipantConfig from "../components/ChatParticipantConfig";
import * as SUBJECTSERVICE from "../services/subject.service";
import TeacherConfig from "../components/teacherConfig";
import * as API from "../API";
import LANGUAGES from "../constants/languages";

export default function ControlPanel() {
  const [location, setLocation] = useState("sessions");
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [language, setLanguage] = useState("en");
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

  const switchLanguage = (language) => {
    switch (language) {
      case "es":
        setLanguage(LANGUAGES.es);
        break;
      case "en":
        setLanguage(LANGUAGES.en);
        break;
      case "pt":
        setLanguage(LANGUAGES.pt);
        break;
      default:
        setLanguage(LANGUAGES.en);
    }
  };

  return (
    <div className="users-main-container">
      <Navbar toolbarLocation={changeToolbarLocation} switchLanguage={switchLanguage} location={location} language={language}/>
      <div className="main-section">
        <Toolbar location={location} search={searchFilter} userRole={userRoleFilter} subjects={subjects} language={language}/>
        <div className="controlPanel-content-container">
          {location === "sessions" ? (
            <Schedulesessionslist search={search} language={language}/>
          ) : location === "events" ? (
            <Scheduleeventslist search={search}language={language}/>
          ) : location === "institutions" ? (
            <InstitutionConfig search={search}language={language}/>
          ) : location === "courses" ? (
            <CourseConfig search={search}language={language}/>
          ) : location === "subjects" ? (
            <SubjectsConfig search={search}language={language}/>
          ) : location === "users" ? (
            <UserConfig search={search} userRole={userRole} language={language}/>
          ) : location === "enroll" ? (
            <EnrollConfig language={language}/>
          ) : location === "teachers" ? (
            <TeacherConfig language={language}/>
          ) : location === "chatConfig" ? (
            <ChatConfig language={language}/>
          ) : location === "chatMessage" ? (
            <ChatMessageConfig language={language}/>
          ) : location === "chatParticipant" ? (
            <ChatParticipantConfig language={language}/>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
