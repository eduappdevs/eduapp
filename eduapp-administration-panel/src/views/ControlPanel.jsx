import React, { useState, useEffect } from "react";
import Toolbar from "../components/toolbar";
import Navbar from "../components/Navbar";
import "../styles/users.css";
import Schedulesessionslist from "../components/schedulesessionslist";
import Scheduleeventslist from "../components/scheduleeventslist";
import InstitutionConfig from "../components/institutionConfig";
import CourseConfig from "../components/courseConfig";
import SubjectsConfig from "../components/subjectsConfig";
import UserConfig from "../components/userConfig";
import EnrollConfig from "../components/enrollConfig";
import axios from "axios";
import * as API from "../API";

export default function ControlPanel() {
  const [location, setLocation] = useState("sessions");

  const changeToolbarLocation = (incoming) => {
    console.log("click", incoming);
    setLocation(incoming);
  };
  const [subjects, setSubjects] = useState([]);
  const fetchSubject = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.SUBJECTS).then((i) => {
        setSubjects(i.data);
      });
    });
  };
  useEffect(() => {
    fetchSubject();
  }, []);

  return (
    <div className="users-main-container">
      <Navbar toolbarLocation={changeToolbarLocation} />
      <div>
        <Toolbar location={location} subjects={subjects} />
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
            <UserConfig />
          ) : location === "enroll" ? (
            <EnrollConfig />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
