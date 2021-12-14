import React from "react";
import { useEffect, useState } from "react";
import "./calendar.css";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import Loader from "../../components/loader/Loader";

export default function Calendar() {
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [monthActual, setMonthActual] = useState("");
  const [daysMonth, setDaysMonth] = useState("");
  const [yearActual, setYearActual] = useState("");
  const today = new Date();
  const day = today.getDate().toString();
  const year = today.getFullYear().toString();
  const month = today.getMonth();
  const monthsNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const lastArrow = () => {
    if (monthActual !== 0) {
      setMonthActual(monthActual - 1);
      setDaysMonth(nDays[monthActual - 1]);
      setYearActual(year);
    } else {
      setMonthActual(11);
      setDaysMonth(nDays[11]);
      setYearActual(year - 1);
    }
  };
  const nextArrow = () => {
    if (monthActual !== 11) {
      setMonthActual(monthActual + 1);
      setDaysMonth(nDays[monthActual + 1]);
      setYearActual(year + 1);
    } else {
      setMonthActual(0);
      setDaysMonth(nDays[0]);
    }
  };
  const leapYear = () => {
    return year % 400 === 0 ? true : year % 100 === 0 ? false : year % 4 === 0;
  };
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
    setMonthActual(month);
    setDaysMonth(nDays[month]);
    setYearActual(year);
    if (leapYear == true) {
      const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
      const nDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);
  return (
    <div>
      <Navbar mobile={ItsMobileDevice} location={"calendar"} />
      <div className="calendar-container">
        <div className="calendar-header">
          {/* <div className="button-today">
            <p>Today</p>
          </div> */}
          <div className="button-arrow-back">
            <svg
              onClick={lastArrow}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 16 16"
            >
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </div>
          <div>
            {monthsNames[monthActual]} {yearActual}
          </div>
          <div className="button-arrow-follow">
            <svg
              onClick={nextArrow}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 16 16"
            >
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
          </div>
          {/* <div className="button-day">
            <p>Day</p>
          </div>
          <div className="button-week">
            <p>Week</p>
          </div>
          <div className="button-month">
            <p>Month</p>
          </div> */}
        </div>
        <div className="calendar_month">
          <div className="container-weekDays">
            {Array.from(Array(7), (e, i) => {
              return <div key={i}>{weekDays[i]}</div>;
            })}
          </div>
          <div className="calendar-container-month">
            {Array.from(Array(daysMonth), (e, i) => {
              if (i + 1 === today.getDate()) {
                return <div className="calendar_today">{i + 1}</div>;
              } else {
                return (
                  <div key={i} className="calendar_days">
                    {i + 1}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      <BottomButtons mobile={ItsMobileDevice} location={"home"} />
    </div>
  );
}
