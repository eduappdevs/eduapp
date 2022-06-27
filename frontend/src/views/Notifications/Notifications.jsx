import { useEffect, useState } from "react";
import { getOfflineUser } from "../../utils/OfflineManager";
import { findById } from "../../services/user.service";
import { fetchEventsById } from "../../services/schedule.service";
import "./notifications.css";

export default function Notifications() {
  const [userInfos, setUserInfos] = useState([]);
  const [calendarEvent, setCalendarEvent] = useState([]);
  const [calendarInfo, setCalendarInfo] = useState([]);

  const fetchUserId = async () => {
    let userID = getOfflineUser().user.id;
    findById(userID).then((e) => {
      setCalendarEvent(e.data[0].calendar_event);
      searchCalendarInfo(calendarEvent);
    });
    setUserInfos(userID);
    console.log(calendarEvent);
    console.log(userInfos);
  };

  const searchCalendarInfo = (info) => {
    fetchEventsById().then((e) => {
      setCalendarInfo(e.data);
    });
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {}, [calendarEvent]);

  return (
    <div className="notifiactions-menu-mobile">
      {calendarEvent.length > 0 ? (
        <div className="notifications-container">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-header-icon">
              <i className="fas fa-bell"></i>
            </div>
          </div>
          <div className="notifications-body">
            {calendarInfo.length > 0
              ? calendarInfo.map((e) => {
                  console.log(e);
                  return (
                    <div className="notifications-body-item">
                      <div className="notifications-body-item-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="notifications-body-item-content">
                        <h4>{e.annotation_title}</h4>
                        <p>{e.annotation_description}</p>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
