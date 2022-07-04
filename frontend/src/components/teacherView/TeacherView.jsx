import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./teacherView.css";

export default function TeacherView({ info }) {
  const [students, setStudents] = useState([]);

  const closeButton = () => {
    document.getElementById("teacher-view").classList.add("view-box-closed");
    document.getElementById("teacher-view").classList.remove("view-box-opened");
    setTimeout(() => {
      document.getElementById("teacher-view").style.display = "none";
    }, 150);
  };

  useEffect(() => setStudents(info), [info]);

  return (
    <div className="teacher-view-container view-box-closed" id="teacher-view">
      <div className="teacher-view">
        <div className="teacher-view-header">
          <div
            onClick={closeButton}
            className="teacher-view-header-close-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
              />
              <path
                fillRule="evenodd"
                d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
              />
            </svg>
          </div>
        </div>
        <div className="teacher-view-contents">
          <h2>Students</h2>
          <div className="student-view">
            {students !== null &&
              students.map((data) => (
                <div className="student-content" key={data.id}>
                  <p>{data.user.email.split("@")[0]}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
