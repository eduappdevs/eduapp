import React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@material-ui/core/Paper";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
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
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from "@devexpress/dx-react-scheduler";
import View from "./eventsView/View";
import CreateView from "./eventsView/CreateView";
import { asynchronizeRequest } from "../../API";
import { getOfflineUser } from "../../utils/OfflineManager";
import * as SCHEDULE_SERVICE from "../../services/schedule.service";
import * as SUBJECT_SERVICE from "../../services/subject.service";
import useViewsPermissions from "../../hooks/useViewsPermissions";
import useRole from "../../hooks/useRole";
import "./calendar.css";

export default function Calendar() {
  const [annotations, setAnnotations] = useState([]);
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [activeEvent, setActiveEvent] = useState({});
  const [subject, setSubject] = useState([]);
  const today = new Date();
  const currentDate = today;

  let userinfo = FetchUserInfo(getOfflineUser().user.id);
  let canCreate = useRole(userinfo, ["eduapp-teacher", "eduapp-admin"]);

  const getCalendar = async () => {
    let events = [];
    let annotations = await SCHEDULE_SERVICE.fetchUserEvents(
      getOfflineUser().user.id
    );
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
    let request = await SUBJECT_SERVICE.fetchUserVariantSubjects(
      getOfflineUser().user.id
    );
    let subject = [];
    request.data.map((e) => {
      let id = e.id;
      let name = e.name;
      subject.push({
        id: id,
        name: name,
      });
      return true;
    });
    setSubject(subject);
  };

  const getCalendarEvent = (data) => {
    for (let event of annotations) {
      if (event === data) {
        setActiveEvent(event);
        break;
      }
    }
  };

  const openCreate = async () => {
    const calendarBox = document.getElementById("create-box");
    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];
    backgroundCalendar.classList.add("background-shadow-animation");
    backgroundCalendar.style.animationDirection = "normal";

    setTimeout(() => {
      document.body.style.overflow = "hidden";
      backgroundCalendar.style.display = "block";
    }, 1);

    setTimeout(() => {
      backgroundCalendar.classList.remove("background-shadow-animation");
      calendarBox.style.display = "flex";
      calendarBox.style.opacity = 1;
      calendarBox.classList.add("create-box-opened");
      calendarBox.classList.remove("create-box-closed");
    }, 150);
  };

  const showEventView = async (event, data) => {
    let scrollElement = event.target;
    while (!scrollElement.id.includes("event_")) {
      scrollElement = scrollElement.parentElement;
    }
    getCalendarEvent(data);

    const viewBox = document.getElementById("view-box");
    viewBox.style.display = "flex";
    const backgroundCalendar =
      document.getElementsByClassName("background-shadow")[0];
    backgroundCalendar.classList.add("background-shadow-animation");
    backgroundCalendar.style.animationDirection = "normal";
    backgroundCalendar.style.display = "block";

    setTimeout(() => {
      viewBox.classList.remove("view-box-closed");
      viewBox.classList.add("view-box-opened");
      document
        .getElementsByClassName("calendar-view-main-container")[0]
        .classList.remove("calendar-view-hidden");
    }, 150);

    setTimeout(() => {
      document.body.style.overflow = "hidden";
      backgroundCalendar.classList.remove("background-shadow-animation");
    }, 550);
  };

  const StyledDiv = styled("div")(({ theme }) => ({}));
  const Appointment = ({ data, children, style, ...restProps }) => (
    <StyledDiv
      id={`event_${data.id}`}
      onClick={(e) => {
        showEventView(e, data);
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

  const IndicatorDiv = styled("div", {
    shouldForwardProp: (prop) => prop !== "top",
  })(({ theme, top }) => ({
    [`& .styled-line`]: {
      height: "2px",
      borderTop: `2px solid #FF8139`,
      width: "100%",
      transform: "translate(0, -1px)",
    },
    [`& .styled-circle`]: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      background: "#FF8139",
    },
    [`& .styled-now`]: {
      position: "absolute",
      zIndex: 1,
      left: 0,
      top,
    },
  }));

  const TimeIndicator = ({ top, ...restProps }) => (
    <IndicatorDiv top={top} {...restProps}>
      <div className={"styled-now styled-circle"} />
      <div className={"styled-now styled-line"} />
    </IndicatorDiv>
  );

  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.innerWidth < 1100) {
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 4000);
  };

  useEffect(() => {
    checkMediaQueries();
    asynchronizeRequest(async function () {
      getCalendar();
      getSubject();
    });

    if (window.innerWidth < 1100) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);

  useViewsPermissions(userinfo, "calendar");

  return (
    <div className="calendar-main-container">
      <section
        id="sectionCalendar"
        className={
          ItsMobileDevice
            ? "mobileSection calendar-main-section"
            : "desktopSection calendar-main-section"
        }
      >
        <Paper>
          <Scheduler data={annotations} locale={window.navigator.language}>
            <ViewState defaultCurrentDate={currentDate} />
            <WeekView startDayHour={6} endDayHour={24} />
            <DayView startDayHour={6} endDayHour={24} />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <Appointments appointmentComponent={Appointment} />
            <AppointmentTooltip showCloseButton visible={false} />
            <CurrentTimeIndicator
              indicatorComponent={TimeIndicator}
              shadePreviousAppointments
              shadePreviousCells
              updateInterval={60}
            />
          </Scheduler>
        </Paper>
      </section>
      <div
        className={canCreate ? "button-calendar-option " : "hidden"}
        onClick={openCreate}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          className="bi bi-plus"
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
