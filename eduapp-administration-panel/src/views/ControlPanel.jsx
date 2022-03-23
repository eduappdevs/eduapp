import React, { useState } from "react";
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

export default function ControlPanel() {
  const [location, setLocation] = useState("sessions");
  const [search, setSearch] = useState('');
  const [userRole, setUserRole] = useState(null);

  const changeToolbarLocation = (incoming) => {
    console.log("click", incoming);
    setLocation(incoming);
  };

  const searchFilter = (search)=>{
    setSearch(search);
  }
  const userRoleFilter = (role) =>{
    console.log(role)
    console.log(role === 'ADMIN' ? 1 : role ==='STUDENT' ?  0 : null)
    setUserRole(role === 'ADMIN' ? 1 : role ==='STUDENT' ?  0 : null);

  }

  return (
    <div className="users-main-container">
      <Navbar toolbarLocation={changeToolbarLocation} />
      <div>
        <Toolbar location={location} search={searchFilter} userRole={userRoleFilter}/>
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
            <UserConfig search={search} userRole={userRole}/>
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
