import React from "react";
import jsreport from "@jsreport/browser-client";
import axios from "axios";
import API, { endpoints } from "../API";
import "../styles/navbar.css";

export default function Navbar(props) {
  const DISPLAY = false;
  const generateResourcesReport = async () => {
    const data = await API.fetchResources();

    let counts = [];
    let labels = [];
    for (let res of data) {
      if (!labels.includes(res.createdBy)) {
        labels.push(res.createdBy);
        counts.push(1);
      } else {
        counts[labels.indexOf(res.createdBy)] += 1;
      }
    }

    const payload = {
      data: {
        resources: data,
        chart_values: counts,
        chart_labels: labels,
      },
    };

    jsreport.serverUrl = endpoints.JSREPORT;
    const report = await jsreport.render({
      template: {
        name: "ResourcesReport",
      },
      data: JSON.stringify(payload),
    });

    report.openInWindow({ title: "Resources Report" });
  };

  const generateMessagesReport = async () => {
    const data = await axios.get(endpoints.CHAT_MESSAGES);

    let dates = [];
    let dateCounts = [];
    for (let msg of data.data) {
      let ftDate = msg.send_date.split("T")[0];
      if (!dates.includes(ftDate)) {
        dates.push(ftDate);
        dateCounts.push(1);
      } else {
        dateCounts[dates.indexOf(ftDate)] += 1;
      }
    }

    const payload = {
      data: {
        chart_values: dateCounts,
        chart_labels: dates,
      },
    };

    jsreport.serverUrl = endpoints.JSREPORT;
    const report = await jsreport.render({
      template: {
        name: "ChatMessagesReport",
      },
      data: JSON.stringify(payload),
    });

    report.openInWindow({ title: "Chat Messages Report" });
  };

  const generateCoursesReport = async () => {
    const data = await axios.get(endpoints.COURSES);

    const payload = {
      data: data.data,
    };
    console.log(payload);

    jsreport.serverUrl = endpoints.JSREPORT;
    const report = await jsreport.render({
      template: {
        name: "RegisteredCoursesReport",
      },
      data: JSON.stringify(payload),
    });

    report.openInWindow({ title: "Registered Courses Report" });
  };

  return (
    <div className="navbar-container">
      <div className="logo">
        <img
          src="http://eduapp-project.eu/wp-content/uploads/2021/03/Logo-EduApp-1-150x150.png"
          alt="eduapplogo"
        />
        <p>Admin</p>
      </div>
      <div className="schedule-button-container button-container">
        <span>
          <p>Schedule</p>
        </span>
        <ul className="button-suboptions">
          <li
            onClick={() => {
              props.toolbarLocation("sessions");
            }}
            className="button-suboptions"
          >
            <p>Sessions</p>
          </li>
          <li
            onClick={() => {
              props.toolbarLocation("events");
            }}
            className="button-suboptions"
          >
            <p>Events</p>
          </li>
        </ul>
      </div>
      <div className="users-button-container button-container">
        <span>
          <p>Users</p>
        </span>
        <ul className="button-suboptions">
          <li
            onClick={() => {
              props.toolbarLocation("users");
            }}
            className="button-suboptions"
          >
            <p>Users</p>
          </li>
          <li
            onClick={() => {
              props.toolbarLocation("enroll");
            }}
            className="button-suboptions"
          >
            <p>Enrollment</p>
          </li>
        </ul>
      </div>
      <div className="settings-button-container button-container">
        <span>
          <p> Settings</p>
        </span>
        <ul className="button-suboptions">
          <li className="button-suboptions">
            <p
              onClick={() => {
                props.toolbarLocation("institutions");
              }}
            >
              Institution
            </p>
          </li>
          <li className="button-suboptions">
            <p
              onClick={() => {
                props.toolbarLocation("courses");
              }}
            >
              Courses
            </p>
          </li>
          <li
            onClick={() => {
              props.toolbarLocation("subjects");
            }}
            className="button-suboptions"
          >
            <p>Subjects</p>
          </li>
        </ul>
      </div>
      <div className="chat-button-container button-container">
        <span>
          <p>Chat Settings</p>
        </span>
        <ul className="button-suboptions">
          <li
            className="button-suboptions"
            onClick={() => {
              props.toolbarLocation("chatConfig");
            }}
          >
            <p>Chat</p>
          </li>
          <li
            className="button-suboptions"
            onClick={() => {
              props.toolbarLocation("chatParticipant");
            }}
          >
            <p>Participants</p>
          </li>
          {DISPLAY ? (
            <li
              className="button-suboptions"
              onClick={() => {
                props.toolbarLocation("chatMessage");
              }}
            >
              <p>Message</p>
            </li>
          ) : (
            console.log()
          )}
        </ul>
      </div>
      <div className="reports-button-container button-container">
        <span>
          <p> Reports</p>
        </span>
        <ul className="button-suboptions">
          <li className="button-suboptions">
            <p
              onClick={async () => {
                await generateResourcesReport();
              }}
            >
              Resources
            </p>
          </li>
          <li className="button-suboptions">
            <p
              onClick={async () => {
                await generateMessagesReport();
              }}
            >
              Chat Messages
            </p>
          </li>
          <li className="button-suboptions">
            <p
              onClick={async () => {
                await generateCoursesReport();
              }}
            >
              Courses
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
