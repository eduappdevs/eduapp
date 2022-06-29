import { useEffect, useState } from "react";
import "./notifications.css";
import IDBManager from "../../utils/IDBManager";

export default function Notifications() {
  const [calendarEvent, setCalendarEvent] = useState([]);
  const [calendarInfo, setCalendarInfo] = useState([]);

  const fetchEvents = async () => {
    let db = new IDBManager();
    await db
      .getStorageInstance("eduapp-calendar-event", "events")
      .then(async (e) => {
        await db.getStoreKeys().then(async (e) => {
          setCalendarEvent(e);
          await db.getMany(e).then(async (info) => {
            setCalendarInfo(info);
          });
        });
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {}, [calendarEvent]);

  return calendarEvent.length > 0 ? (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <div className="notifications-body">
        {calendarInfo.length > 0
          ? calendarInfo.map((e) => {
              return (
                <div className="notifications-body-item-content">
                  <h2>{e.annotation_title}</h2>
                  <h4>Description:</h4>
                  <div className="notification-body-description">
                    <textarea
                      disabled
                      defaultValue={e.annotation_description}
                    />
                  </div>
                  <div className="notification-body-date">
                    <p id="first_hour">
                      {"Start date: "}
                      {e.annotation_start_date.split("T")[0]}{" "}
                      {e.annotation_start_date.split("T")[1]}
                    </p>
                    <p>
                      {"End date: "}
                      {e.annotation_end_date.split("T")[0]}{" "}
                      {e.annotation_end_date.split("T")[1]}
                    </p>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  ) : null;
}
