import React from "react";
import { useEffect, useState } from "react";
import "./calendar.css";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import DarkModeChanger from "../../components/DarkModeChanger";
import MenuCalendar from "./menu/MenuCalendar";

export default function Calendar() {
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const openMenu = () => {
    const menu = document.getElementById("menu_calendarOption_container");
    setTimeout(() => {
      try {
        if (menu.classList.contains("menu_calendarOption_hidden")) {
          menu.classList.remove("menu_calendarOption_hidden");
          document
            .getElementById("button-menu-svg")
            .classList.add("menu_calendarOption_hidden");
        } else {
          menu.classList.add("menu_calendarOption_hidden");
          document
            .getElementById("button-menu-svg")
            .classList.remove("menu_calendarOption_hidden");
        }
      } catch (error) {
        console.log(error);
      }
    }, 100);
  };
  const today = new Date();
  const currentDate = today;
  const schedulerData = [
    {
      startDate: "2022-01-06T09:45",
      endDate: "2022-01-06T11:00",
      title: "Meeting",
    },
    {
      startDate: "2021-12-15T12:00",
      endDate: "2021-12-15T13:30",
      title: "Go to a gym",
    },
  ];
  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        DarkModeChanger(localStorage.getItem("darkMode"));
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 4000);
  };
  useEffect(() => {
    checkMediaQueries();
    DarkModeChanger(localStorage.getItem("darkMode"));
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);
  return (
    <div>
      <div className="calendar-main-container">
        <Navbar mobile={ItsMobileDevice} location={"calendar"} />
        <section
          className={ItsMobileDevice ? "mobileSection" : "desktopSection"}
        >
          <div className="calendar">
            <div className="calendar-container">
              <div className="button-menu">
                <svg
                  id="button-menu-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="bi bi-list"
                  viewBox="0 0 16 16"
                  onClick={() => {
                    openMenu();
                  }}
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </div>
              <div
                id="menu_calendarOption_container"
                className="menu_calendarOption_container menu_calendarOption_hidden"
              >
                <div className="menu-calendar">
                  <div className="button-close-calendar-option">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-x-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </div>

                  <ul>
                    <li>
                      <a>Schedule</a>
                    </li>
                    <li>
                      <a>Day</a>
                    </li>
                    <li>
                      <a>Week</a>
                    </li>
                    <li>
                      <a>Month</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <div className="calendar">
            <Paper>
              <Scheduler data={schedulerData}>
                <ViewState
                  defaultCurrentDate={currentDate}
                  currentViewName={"Week"}
                />
                <WeekView startDayHour={6} endDayHour={24} />
                <ViewState currentDate={currentDate} />
                <DayView startDayHour={6} endDayHour={25} />
                <Appointments />
              </Scheduler>
            </Paper>
          </div> */}
          </div>
        </section>
        <div className="button-calendar-option">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            class="bi bi-plus"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </div>
        <BottomButtons mobile={ItsMobileDevice} location={"calendar"} />
      </div>
    </div>
  );
}
