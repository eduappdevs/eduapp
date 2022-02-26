import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@material-ui/core/Paper";
import {
  Scheduler,
  DateNavigator,
  DayView,
  Appointments,
  WeekView,
  Toolbar,
  ViewSwitcher,
  TodayButton,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import { CALENDAR } from "../../config";
import View from "./eventsView/View";
import CreateView from "./eventsView/CreateView";
import "./calendar.css";

export default function Calendar() {
  const [annotations, setAnnotations] = useState([]);
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [activeEvent, setActiveEvent] = useState({});
  const [subject, setSubject] = useState([]);
  let userInfo = FetchUserInfo(localStorage.userId);

  const today = new Date();
  const currentDate = today;

  const getCalendar = async () => {
    let events = [];
    let annotations = await axios.get(CALENDAR + localStorage.userId);
    let data = annotations.data;

    for (let globalEvent in data.globalEvents) {
      if (data.globalEvents !== null) {
        let e = data.globalEvents[globalEvent];
        let id = e.id;
        let startDate = e.annotation_start_date;
        let endDate = e.annotation_end_date;
        let title = e.annotation_title;
        let description = e.annotation_description;
        let subject = e.subject_id;
        let backgroundColor;
        for (let i in data.colorEvents) {
          if (data.colorEvents[i][0] === subject) {
            backgroundColor = data.colorEvents[i][1];
          }
        }
        events.push({
          id: id,
          startDate: startDate,
          endDate: endDate,
          title: title,
          description: description,
          subject_id: subject,
          backgroundColor: backgroundColor,
        });
      }
    }

    for (let calendarEvent in data.calendarEvents) {
      if (data.calendarEvents !== null) {
        let calendarEvents = data.calendarEvents[calendarEvent];
        let id = calendarEvents.id;
        let startDate = calendarEvents.annotation_start_date;
        let endDate = calendarEvents.annotation_end_date;
        let title = calendarEvents.annotation_title;
        let description = calendarEvents.annotation_description;
        let subject = calendarEvents.subject_id;
        let isGlobal = calendarEvents.isGlobal;
        let backgroundColor;
        for (let i in data.colorEvents) {
          if (data.colorEvents[i][0] === subject) {
            backgroundColor = data.colorEvents[i][1];
          }
        }
        events.push({
          id: id,
          startDate: startDate,
          endDate: endDate,
          title: title,
          description: description,
          subject_id: subject,
          backgroundColor: backgroundColor,
          isGlobal: isGlobal,
        });
      }
    }

    for (let session in data.sessions) {
      console.log(data.sessions);
      if (data.sessions !== null) {
        let e = data.sessions[session];
        let id = e.id;
        let startDate = e.session_start_date;
        let endDate = e.session_end_date;
        let title = e.session_name;
        let resources = e.resources_platform;
        let stream = e.streaming_platform;
        let chat = e.session_chat_id;
        let subject = e.subject_id;
        let backgroundColor;
        for (let i in data.colorEvents) {
          if (data.colorEvents[i][0] === subject) {
            backgroundColor = data.colorEvents[i][1];
          }
        }
        events.push({
          id: id,
          startDate: startDate,
          endDate: endDate,
          title: title,
          stream: stream,
          resources: resources,
          chat: chat,
          subject_id: subject,
          backgroundColor: backgroundColor,
        });
      }
    }
    setAnnotations(events);
  };

  const getSubject = async () => {
    let request = await axios
      .get("http://localhost:3000/subjects?course_id=" + localStorage)
      .then()
      .catch();
    let subject = [];
    let e = request.data;
    request.data.map((e) => {
      let id = e.id;
      let name = e.name;
      subject.push({
        id: id,
        name: name,
      });
    });
    setSubject(subject);
  };

  const getCalendarEvent = (eventId) => {
    for (let event of annotations) {
      if (event.id === eventId) {
        setActiveEvent(event);
        break;
      }
    }
    for (let s of subject) {
    }
  };

  const openCreate = async () => {
    const chatBox = document.getElementById("create-box");
    chatBox.style.display = "flex";
    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];
    const calendarMainScroll = document.getElementsByClassName(
      "calendar-main-container"
    )[0];
    setTimeout(() => {
      calendarMainScroll.classList.add("disable-scroll");
      backgroundCalendar.style.display = "block";
    }, 200);

    setTimeout(() => {
      chatBox.classList.add("create-box-opened");
      chatBox.classList.remove("calendar-view-create-hidden");
    }, 400);
  };

  const showEventView = async (eventId) => {
    getCalendarEvent(eventId);
    const viewBox = document.getElementById("view-box");
    viewBox.style.display = "flex";
    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];
    const calendarMainScroll = document.getElementsByClassName(
      "calendar-main-container"
    )[0];
    setTimeout(() => {
      viewBox.classList.remove("view-box-closed");
      viewBox.classList.add("view-box-opened");
      document
        .getElementsByClassName("calendar-view-main-container")[0]
        .classList.remove("calendar-view-hidden");
    }, 1);
    setTimeout(() => {
      calendarMainScroll.classList.add("disable-scroll");
      backgroundCalendar.style.display = "block";
    }, 500);
  };

  const StyledDiv = styled("div")(({ theme }) => ({}));
  const Appointment = ({ data, children, style, ...restProps }) => (
    <StyledDiv
      className={`event_${data.id}`}
      onClick={() => {
        showEventView(data.id);
      }}
    >
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: data.backgroundColor,
          borderRadius: "8px",
        }}
      >
        {children}
      </Appointments.Appointment>
    </StyledDiv>
  );

  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 4000);
  };

  useEffect(() => {
    checkMediaQueries();
    getCalendar();
    getSubject();

    if (window.matchMedia("(max-width: 1100px)").matches) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);

  return (
    <div className="calendar-main-container">
      <section
        className={
          ItsMobileDevice
            ? "mobileSection calendar-main-section"
            : "desktopSection calendar-main-section"
        }
      >
        <div className="calendar">
          <div className="calendar-container">
            <div className="calendar-api">
              <Paper>
                <Scheduler
                  data={annotations}
                  locale={window.navigator.language}
                >
                  <ViewState defaultCurrentDate={currentDate} />
                  <WeekView startDayHour={6} endDayHour={24} />
                  <DayView startDayHour={6} endDayHour={24} />
                  <Toolbar />
                  <DateNavigator />
                  <TodayButton />
                  <ViewSwitcher />
                  <Appointments appointmentComponent={Appointment} />
                  <AppointmentTooltip showCloseButton visible={false} />
                </Scheduler>
              </Paper>
            </div>
          </div>
        </div>
      </section>
      <div className="button-calendar-option" onClick={openCreate}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          class="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </div>
      <div className="background-shadow"></div>
      <View data={activeEvent} />
      <CreateView data={subject} />
    </div>
  );
}
