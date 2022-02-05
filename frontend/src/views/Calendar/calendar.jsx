import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
  Toolbar,
  ViewSwitcher,
  TodayButton,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import DarkModeChanger from "../../components/DarkModeChanger";
import MenuCalendar from "./menu/MenuCalendar";
import "./calendar.css";

export default function Calendar() {
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);

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
    <div className="calendar-main-container">
      <Navbar mobile={ItsMobileDevice} location={"calendar"} />
      <section className={ItsMobileDevice ? "mobileSection" : "desktopSection"}>
        <div className="calendar">
          <div className="calendar-container">
            <div className="calendar-api">
              <Paper>
                <Scheduler data={schedulerData}>
                  <ViewState
                    defaultCurrentDate={currentDate}
                    defaultCurrentViewName="Week"
                  />
                  <WeekView
                    startDayHour={today.getHours() - 1.5}
                    endDayHour={today.getHours() + 7.5}
                  />
                  <DayView
                    startDayHour={today.getHours() - 1.5}
                    endDayHour={today.getHours() + 7.5}
                  />
                  <Toolbar/>
                  <DateNavigator />
                  <TodayButton />
                  <ViewSwitcher />
                  <Appointments />
                </Scheduler>
              </Paper>
            </div>
          </div>
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
  );
}
