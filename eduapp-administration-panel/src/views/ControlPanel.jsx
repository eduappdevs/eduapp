import React, { useState } from "react";
import Toolbar from "../components/toolbar";
import Navbar from "../components/Navbar";
import "../styles/users.css";
import Schedulesessionslist from "../components/schedulesessionslist";
import Scheduleeventslist from "../components/scheduleeventslist";
import Resourceslist from "../components/resourceslist";
import InstitutionConfig from "../components/institutionConfig";
import CoursesConfig from "../components/coursesConfig";

export default function ControlPanel() {
  const [location, setLocation] = useState("sessions");

  const changeToolbarLocation = (incoming) => {
    console.log("click", incoming);
    setLocation(incoming);
  };

  return (
    <div className="users-main-container">
      <Navbar toolbarLocation={changeToolbarLocation} />
      <div>
        <Toolbar location={location} />
        <div className="controlPanel-content-container">
          {location === "sessions" ? (
            <Schedulesessionslist />
          ) : location === "events" ? (
            <Scheduleeventslist />
          ) : location === "institutions" ? (
            <InstitutionConfig />
          ) : location === "courses" ? (
            <CoursesConfig />
          ) : (
            location === "resources" && <Resourceslist />
          )}
        </div>
      </div>
    </div>
  );
}
