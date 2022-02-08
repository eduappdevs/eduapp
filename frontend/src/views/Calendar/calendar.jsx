import React from "react";
import axios from "axios";
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
  AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";
import DarkModeChanger from "../../components/DarkModeChanger";
import "./calendar.css";

export default function Calendar() {
  const [annotations, setAnnotations] = useState([])
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  let temp = []
  const getCalendar = async() => {
    let annotations = await axios.get("http://localhost:3000/calendar_annotations/");
    for (let e of annotations.data) {
        let id = e.id;
        let startDate = e.annotation_start_date;
        let endDate = e.annotation_end_date;
        let title = e.annotation_title;
        let description = e.annotation_description;
        temp.push({
          id: id,
          startDate: startDate,
          endDate: endDate,
          title: title
        });

    }
    setAnnotations(temp)
  }
  const today = new Date();
  const currentDate = today;
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
    getCalendar();
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
              <Scheduler data={annotations}>
                <ViewState defaultCurrentDate={currentDate} />
                <WeekView startDayHour={6} endDayHour={24} />
                <DayView startDayHour={6} endDayHour={24} />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
                <Appointments />
                <AppointmentTooltip/>
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
