import React from 'react';
import './views.css';
import { useEffect, useState } from 'react';
import EditView from './EditView';

export default function View(props) {
  const [editEvent, setEditEvent] = useState({});
  const closeButton = async () => {
    const editBox = document.getElementById('view-box');

    editBox.style.display = 'flex';

    const backgroundCalendar =
      document.getElementsByClassName('background-shadow')[0];

    editBox.classList.remove('view-box-opened');
    editBox.classList.add('view-box-closed');

    document
      .getElementsByClassName('calendar-main-container')[0]
      .classList.remove('disable-scroll');

    setTimeout(() => {
      backgroundCalendar.style.display = 'none';
      editBox.classList.add('calendar-view-hidden');
    }, 150);
  };

  const openEditMenu = async () => {
    let eventEdit = props.data;
    setEditEvent(eventEdit);
    const editBox = document.getElementById('edit-box');
    editBox.style.display = 'flex';
    const backgroundCalendar =
      document.getElementsByClassName('background-shadow')[0];
    const calendarMainScroll = document.getElementsByClassName(
      'calendar-main-container'
    )[0];
    setTimeout(() => {
      calendarMainScroll.classList.add('disable-scroll');
      backgroundCalendar.style.display = 'block';
    }, 100);
    setTimeout(() => {
      editBox.classList.add('edit-box-opened');
      editBox.classList.remove('calendar-view-edit-hidden');
    }, 400);
  };
  const getTime = () => {
    if (props.data.startDate !== undefined) {
      let start = props.data.startDate;
      let end = props.data.endDate;
      start = start.split('T')[1];
      end = end.split('T')[1];
      return start + '-' + end;
    }
  };

  return (
    <div
      id="view-box"
      className="calendar-view-main-container calendar-view-hidden view-box-closed"
    >
      <div className="calendar-view">
        <div className="calendar-view-header">
          <div
            className="calendar-view-header-edit-button"
            onClick={openEditMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="bi bi-pencil"
              viewBox="0 0 16 16"
            >
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
            </svg>
          </div>
          <div
            className="calendar-view-header-close-button"
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
        <div className="calendar-view-contents">
          <div className="calendar-view-contents-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="bi bi-circle-fill"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>
            <p>{props.data.title}</p>
          </div>
          <div className="calendar-view-contents-info">
            <div className="calendar-view-hour">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-clock"
                viewBox="0 0 16 16"
              >
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
              <p>{getTime()}</p>
            </div>
            <div className="calendar-view-description">
              <h3>Description</h3>
              <p>{props.data.description}</p>
            </div>
          </div>
        </div>
      </div>
      <EditView data={editEvent} />
    </div>
  );
}
