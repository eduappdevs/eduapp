/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import jsreport from "@jsreport/browser-client";
import logoeduapp from "../assets/eduappadmin.png";
import API, { endpoints } from "../API";
import { fetchMessage } from "../services/chat.service";
import { fetchCourses } from "../services/course.service";
import { fetchResourcesJson } from "../services/resource.service";
import LanguageSwitcher from "./LanguageSwitcher";
import { interceptExpiredToken } from "../utils/OfflineManager";
import { LanguageCtx } from "../hooks/LanguageContext";
import "./componentStyles/languageSwitcher.css";
import "../styles/navbar.css";

export default function Navbar({ locationState }) {
  const [language] = useContext(LanguageCtx);
  const [activeSection, setActiveSection] = useState("");
  const [location, setLocation] = locationState;
  const DISPLAY = false;

  const toolbarLocation = (loc) => {
    setLocation(loc);
    localStorage.setItem("eduapp_last_viewed", loc);
  };

  const generateResourcesReport = async () => {
    API.asynchronizeRequest(function () {
      fetchResourcesJson
        .then((e) => {
          e.data.map((resource) => {
            let counts = [];
            let labels = [];
            for (let res of resource) {
              if (!labels.includes(res.createdBy)) {
                labels.push(res.createdBy);
                counts.push(1);
              } else {
                counts[labels.indexOf(res.createdBy)] += 1;
              }
            }

            const payload = {
              data: {
                resources: resource,
                chart_values: counts,
                chart_labels: labels,
              },
            };

            jsreport.serverUrl = endpoints.JSREPORT;
            const report = jsreport.render({
              template: {
                name: "ResourcesReport",
              },
              data: JSON.stringify(payload),
            });

            report.openInWindow({ title: "Resources Report" });
          });
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          console.error(err);
        });
    });
  };

  const generateMessagesReport = async () => {
    API.asynchronizeRequest(function () {
      fetchMessage()
        .then((e) => {
          e.data.map((sms) => {
            let dates = [];
            let dateCounts = [];
            for (let msg of sms) {
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
            const report = jsreport.render({
              template: {
                name: "ChatMessagesReport",
              },
              data: JSON.stringify(payload),
            });

            report.openInWindow({ title: "Chat Messages Report" });
          });
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          console.error(err);
        });
    });
  };

  const generateCoursesReport = async () => {
    API.asynchronizeRequest(function () {
      fetchCourses()
        .then((e) => {
          e.data.map((course) => {
            const payload = {
              data: course,
            };
            jsreport.serverUrl = endpoints.JSREPORT;
            const report = jsreport.render({
              template: {
                name: "RegisteredCoursesReport",
              },
              data: JSON.stringify(payload),
            });

            report.openInWindow({ title: "Registered Courses Report" });
          });
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          console.error(err);
        });
    });
  };

  const displayClock = () => {
    const display = new Date().toLocaleTimeString();
    document.getElementById("liveClock").innerHTML = display;
    setTimeout(displayClock, 1000);
  };

  useEffect(() => {
    setActiveSection(location);
  }, [location]);

  useEffect(() => displayClock(), []);

  return (
    <div className="navbar-container">
      <div className="navbar-header">
        <div className="logo">
          <img src={logoeduapp} alt="eduapplogo" />
        </div>
        <LanguageSwitcher />
        <div id="liveClock" />
      </div>
      <div className="schedule-button-container button-container">
        <span>
          <p>{language.schedule}</p>
        </span>
        <ul className={"suboptions"}>
          <li
            onClick={() => {
              toolbarLocation("sessions");
            }}
            className={
              activeSection === "sessions"
                ? "active button-suboption"
                : "button-suboptions"
            }
          >
            <p>{language.sessions}</p>
          </li>
          <li
            onClick={() => {
              toolbarLocation("events");
            }}
            className={
              activeSection === "events"
                ? "active button-suboption"
                : "button-suboptions"
            }
          >
            <p>{language.events}</p>
          </li>
        </ul>
      </div>
      <div className="users-button-container button-container">
        <span>
          <p>Users</p>
        </span>
        <ul className={"suboptions"}>
          <li
            onClick={() => {
              toolbarLocation("users");
            }}
            className={
              activeSection === "users"
                ? "active button-suboption"
                : "button-suboptions"
            }
          >
            <p>{language.users}</p>
          </li>
          <li
            onClick={() => {
              toolbarLocation("enroll");
            }}
            className={
              activeSection === "enroll"
                ? "active button-suboption"
                : "button-suboptions"
            }
          >
            <p>{language.enrollment}</p>
          </li>
          <li
            onClick={() => {
              toolbarLocation("teachers");
            }}
            className={
              activeSection === "teachers"
                ? "active button-suboption"
                : "button-suboptions"
            }
          >
            <p>{language.teachers}</p>
          </li>
        </ul>
      </div>
      <div className="settings-button-container button-container">
        <span>
          <p>{language.management}</p>
        </span>
        <ul className={"suboptions"}>
          <li
            className={
              activeSection === "courses"
                ? "active button-suboptions"
                : "button-suboptions"
            }
          >
            <p
              onClick={() => {
                toolbarLocation("courses");
              }}
            >
              {language.courses}
            </p>
          </li>
          <li
            onClick={() => {
              toolbarLocation("subjects");
            }}
            className={
              activeSection === "subjects"
                ? "active button-suboptions"
                : "button-suboptions"
            }
          >
            <p>{language.subjects}</p>
          </li>
          <li
            onClick={() => {
              toolbarLocation("resources");
            }}
            className={
              activeSection === "resources"
                ? "active button-suboptions"
                : "button-suboptions"
            }
          >
            <p>{language.resources}</p>
          </li>
        </ul>
      </div>
      <div className="settings-button-container button-container">
        <span>
          <p>{language.settings}</p>
        </span>
        <ul className={"suboptions"}>
          <li
            className={
              activeSection === "institutions"
                ? "active button-suboption"
                : "button-suboptions"
            }
          >
            <p
              onClick={() => {
                toolbarLocation("institutions");
              }}
            >
              {language.institution}
            </p>
          </li>
          <li
            className={
              activeSection === "userRoles"
                ? "active button-suboption"
                : "button-suboptions"
            }
          >
            <p
              onClick={() => {
                toolbarLocation("userRoles");
              }}
            >
              {language.userRoles}
            </p>
          </li>
        </ul>
      </div>
      <div className="chat-button-container button-container">
        <span>
          <p>{language.chatSettings}</p>
        </span>
        <ul className="suboptions">
          <li
            className={
              activeSection === "chatConfig"
                ? "active button-suboptions"
                : "button-suboptions"
            }
            onClick={() => {
              toolbarLocation("chatConfig");
            }}
          >
            <p>{language.chat}</p>
          </li>
          <li
            className={
              activeSection === "chatParticipant"
                ? "active button-suboptions"
                : "button-suboptions"
            }
            onClick={() => {
              toolbarLocation("chatParticipant");
            }}
          >
            <p>{language.participants}</p>
          </li>
          {DISPLAY ? (
            <li
              className={
                activeSection === "chatMessage"
                  ? "active button-suboptions"
                  : "button-suboptions"
              }
              onClick={() => {
                toolbarLocation("chatMessage");
              }}
            >
              <p>{language.message}</p>
            </li>
          ) : (
            <></>
          )}{" "}
        </ul>
      </div>
      {/* <div className="reports-button-container button-container">
        <span>
          <p>{language.reports}</p>
        </span>
        <ul className={"suboptions"}>
          <li className={"reports_options active"}>
            <p
              onClick={async () => {
                await generateResourcesReport();
              }}
            >
              {language.resources}
            </p>
          </li>
          <li className={"reports_options active"}>
            <p
              onClick={async () => {
                await generateMessagesReport();
              }}
            >
              {language.chatMessages}
            </p>
          </li>
          <li className={"reports_options active"}>
            <p
              onClick={async () => {
                await generateCoursesReport();
              }}
            >
              {language.courses}
            </p>
          </li>
        </ul>
      </div> */}
    </div>
  );
}
