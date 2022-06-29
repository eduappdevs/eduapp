import React from "react";
import { useEffect } from "react";
import "./eventPop.css";

export default function EventPop({ show, close, data }) {
  const eventPop = async () => {};
  useEffect(() => {
    eventPop();
  }, []);
  return data.length !== 0 ? (
    <>
      <div
        className="notification-container"
        id="notification-container"
        style={{ display: show ? "flex" : "none" }}
      >
        <div className="notification-information" id="notification-information">
          <div className="close-button" onClick={close}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <div className="notification-body">
            <div className="notification-body-information">
              <h3>{data.annotation_title}</h3>
              <h4>Description:</h4>

              <div className="notification-body-description">
                <textarea disabled defaultValue={data.annotation_description} />
              </div>
              <div className="notification-body-date">
                {data.annotation_end_date.split("T")[0] !==
                data.annotation_start_date.split("T")[0] ? (
                  <>
                    <p id="first_hour">
                      {"Start date: "}
                      {data.annotation_start_date.split("T")[0]}{" "}
                      {data.annotation_start_date.split("T")[1]}
                    </p>
                    <p>
                      {"End date: "}
                      {data.annotation_end_date.split("T")[0]}{" "}
                      {data.annotation_end_date.split("T")[1]}
                    </p>
                  </>
                ) : (
                  <>
                    <p id="first_hour">
                      {data.annotation_start_date.split("T")[1]}
                    </p>
                    <p>{data.annotation_end_date.split("T")[1]}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
