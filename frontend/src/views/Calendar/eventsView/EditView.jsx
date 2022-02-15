import axios from "axios";
import React, { useEffect, useState } from "react";
import "./views.css";
export default function EditView(props) {
  const [updateValue, setUpdateValue] = useState({});
  const getTimeStart = () => {
    if (props.data.startDate !== undefined) {
      let start = props.data.startDate;
      start = start.split("T")[1];
      return start;
    }
  };
  const getTimeEnd = () => {
    if (props.data.startDate !== undefined) {
      let end = props.data.endDate;
      end = end.split("T")[1];
      return end;
    }
  };
  function enableScroll() {
    var wheelEvent =
      "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
    window.removeEventListener(
      wheelEvent,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );
    window.removeEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );
    window.removeEventListener(
      "keydown",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );
  }
  const closeButton = async () => {
    document
      .getElementsByClassName("calendar-view-edit-main-container")[0]
      .classList.add("calendar-view-edit-hidden");
    document
      .getElementsByClassName("button-calendar-option")[0]
      .classList.remove("button-calendar-option-hidden");
      document
      .getElementsByClassName("calendar-main-container")[0]
      .classList.remove("positionFixed");
    enableScroll();
  };
  const valueInput = async (e) => {
    console.log({ [e.target.name]: e.target.value });
    // setUpdateValue()
  };
  const updateEvent = async (e) => {
    e.preventDefault();
    // var titleValue = document.getElementById("title").value;
    // var descriptionValue = document.getElementById("description").value;
    // var startValue = document.getElementById("start").value;
    // var endValue = document.getElementById("end").value;
    // console.log(titleValue, endValue, startValue, descriptionValue);
    // axios
    //   .put(`http://localhost:3000/resources/${props.data.id}`)
    //   .then()
    //   .catch();
    document
      .getElementsByClassName("calendar-view-edit-main-container")[0]
      .classList.add("calendar-view-edit-hidden");
  };

  return (
    <div className="calendar-view-edit-main-container calendar-view-edit-hidden">
      <div className="calendar-view-edit">
        <div className="calendar-view-edit-header">
          <div className="calendar-view-edit-header-delete-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi bi-trash3"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
            </svg>
          </div>
          <div
            className="calendar-view-edit-header-close-button"
            onClick={closeButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
              />
              <path
                fill-rule="evenodd"
                d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
              />
            </svg>
          </div>
        </div>
        <div className="calendar-view-edit-contents">
          <form action="submit" onSubmit={updateEvent}>
            <div className="calendar-view-edit-title">
              <h3>Title</h3>
              <input
                id="title"
                placeholder={props.data.title}
                name="title"
                type="text"
                onChange={valueInput}
              ></input>
            </div>
            <div className="calendar-view-edit-hour">
              <h3>Hour</h3>
              <div className="calendar-view-edit-hour-input">
                <input
                  id="start"
                  name="start"
                  type="time"
                  value={getTimeStart()}
                />
                <input id="end" name="end" type="time" value={getTimeEnd()} />
              </div>
            </div>
            <div className="calendar-view-edit-description">
              <h3>Description</h3>
              <textarea
                id="description"
                placeholder={props.data.description}
                name="description"
                type="text"
                maxlength="150"
              />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
