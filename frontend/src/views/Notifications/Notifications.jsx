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
                  <div className="notification-body-description">
                    <textarea
                      disabled
                      defaultValue={e.annotation_description}
                    />
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  ) : null;
}
