/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Resources from "./views/resources/Resources";
import Login from "./views/login/Login";
import Home from "./views/home/Home";
import RequireAuth from "./components/auth/RequireAuth";
import ManagementPanel from "./views/ManagementPanel/ManagementPanel";
import { FetchUserInfo } from "./hooks/FetchUserInfo";
import Loader, { runCloseAnimation } from "./components/loader/Loader";
import Calendar from "./views/Calendar/Calendar";
import ChatMenu from "./views/chat/ChatMenu";
import MainChatInfo from "./views/chat/mainChat/mainChatInfo/MainChatInfo";
import BottomButtons from "./components/bottomButtons/BottomButtons";
import Navbar from "./components/navbar/Navbar";
import DarkModeChanger from "./components/DarkModeChanger";
import FirebaseStorage from "./utils/FirebaseStorage";
import * as SCHEDULE_SERVICE from "./services/schedule.service";
import OpenedResource from "./views/resources/openedResource/OpenedResource";
import MainChat from "./views/chat/mainChat/MainChat";
import Menu from "./views/menu/Menu";
import ProfileSettings from "./views/menu/profileOptions/ProfileSettings";
import MenuSettings from "./views/menu/menu-settings/MenuSettings";
import PasswordRecovery from "./views/passwordRecovery/PasswordRecovery";
import GroupChatCreate from "./views/chat/createGroupChat/GroupChatCreate";
import DirectChatCreate from "./views/chat/createDirectChat/DirectChatCreate";
import instanceBadge, {
  resetBadge,
} from "./components/notifications/notifications";
import WebTitle from "./components/WebTitle";
import { getOfflineUser } from "./utils/OfflineManager";
import useRole from "./hooks/useRole";
import Notifications from "./views/Notifications/Notifications";
import { MainChatInfoCtxProvider } from "./hooks/MainChatInfoContext";
import NotifsAC from "./utils/websockets/actioncable/NotifsAC";
import EventPop from "./components/eventPop/EventPop";
import useMobile from "./hooks/useMobile";
import IDBManager from "./utils/IDBManager";

const notifs = new NotifsAC();
export default function App() {
  const [needsExtras, setNeedsExtras] = useState(false);
  const [needsLoader, setNeedsLoader] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [calendarInfo, setCalendarInfo] = useState([]);

  let userinfo = FetchUserInfo(
    getOfflineUser().user === null ? -1 : getOfflineUser().user.id
  );
  let isAdmin = useRole(userinfo, "eduapp-admin");
  const mobile = useMobile();

  const activeNotification = async () => {
    if (getOfflineUser().user !== null) {
      let db = new IDBManager();
      await db.getStorageInstance("eduapp-calendar-event", "events");
      SCHEDULE_SERVICE.fetchEventsById(getOfflineUser().user.id).then(
        async (e) => {
          if (e) {
            db.clear();
            e.data.map(async (data) => {
              await db.set(data.id, data, "events");
            });
            await db.getStorageInstance("eduapp-calendar-last-event", "last");
            let key = await db.getStoreKeys();
            if (key[0] !== e.data[e.data.length - 1].id) {
              setCalendarInfo(e.data[e.data.length - 1]);
              setShowNotification(true);
            } else {
              setShowNotification(false);
              setCalendarInfo(e.data[e.data.length - 1]);
            }
          }
        }
      );
    }
  };

  const closeEventPop = async () => {
    document.getElementById("notification-container").style.animation =
      "bg-fade-out";
    document.getElementById("notification-information").style.animation =
      "modal-close-popup";
    let db2 = new IDBManager();
    await db2.getStorageInstance("eduapp-calendar-last-event", "last");
    await db2.clear();
    await db2.set(calendarInfo.id, calendarInfo, "last");
    setShowNotification(false);
  };

  useEffect(() => {
    notifs.instanceURC_IDB();
    if (localStorage.eduapp_language === undefined) {
      localStorage.setItem("eduapp_language", "en_uk");
    }

    instanceBadge();

    setNeedsExtras(
      !new RegExp(
        "/(login|menu(/.*)?|resource/[0-9]+|chat/([a-z]|[A-Z]|[0-9])(.*)|password/.*)$"
      ).test(window.location.href)
    );

    setNeedsLoader(
      !new RegExp("/(menu(/.*)?|chat/create/(direct|group))$").test(
        window.location.href
      )
    );
    activeNotification();

    if (new RegExp("/(resource/[0-9]+)$").test(window.location.href)) {
      window.addEventListener("canLoadResource", () => {
        setTimeout(() => {
          runCloseAnimation();
        }, 300);
      });
    } else if (
      new RegExp("/(?!chat/create)(chat/([a-z]|[A-Z]|[0-9])(.*))$").test(
        window.location.href
      )
    ) {
      window.addEventListener("canLoadChat", () => {
        setTimeout(() => {
          runCloseAnimation();
        }, 300);
      });
    } else {
      setTimeout(() => {
        runCloseAnimation();
      }, 500);
    }

    try {
      DarkModeChanger(localStorage.getItem("darkMode"));
    } catch (err) {
    } finally {
      FirebaseStorage.init();
    }

    document.addEventListener("visibilitychange", () => resetBadge());

    if (getOfflineUser().user !== null) {
      notifs.generateChannelConnection();
    }

    return () => {
      document.removeEventListener("visibilitychange", () => {});
      document.removeEventListener("canLoadResource", () => {});
      document.removeEventListener("canLoadChat", () => {});
    };
  }, []);

  return userinfo ? (
    <>
      <BrowserRouter>
        <WebTitle />
        <>
          <div style={{ display: needsLoader ? "flex" : "none" }}>
            <Loader />
          </div>
        </>
        {needsExtras && (
          <>
            <Navbar badgeCount={badgeCount} mobile={mobile} />
          </>
        )}
        {RequireAuth() ? (
          <MainChatInfoCtxProvider>
            <Routes>
              {/* Main Pages */}
              <Route exact path="/home" element={<Home />} />
              <Route exact path="/resources" element={<Resources />} />
              <Route exact path="/calendar" element={<Calendar />} />
              <Route exact path="/chat" element={<ChatMenu />} />
              {isAdmin && (
                <Route exact path="/management" element={<ManagementPanel />} />
              )}

              {/* Pages Subroutes */}
              <Route
                path="/resource/:resourceId"
                element={<OpenedResource />}
              />
              <Route path="/chat/:chatId" element={<MainChat />} />
              <Route path="/chat/info/:chatId" element={<MainChatInfo />} />
              <Route path="/chat/create/group" element={<GroupChatCreate />} />
              <Route
                path="/chat/create/direct"
                element={<DirectChatCreate />}
              />

              {/* Menu */}
              {mobile && (
                <>
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/menu/profile" element={<ProfileSettings />} />
                  <Route path="/menu/settings" element={<MenuSettings />} />
                </>
              )}

              {/*Notifications*/}
              <Route path="/notifications" element={<Notifications />} />

              {/* Unknown URL Reroute */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </MainChatInfoCtxProvider>
        ) : (
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route
              exact
              path="/password/reset/"
              element={<PasswordRecovery />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
        {needsExtras && mobile && (
          <>
            <BottomButtons badgeCount={badgeCount} mobile={mobile} />
          </>
        )}
        <>
          <EventPop
            show={showNotification}
            close={() => {
              closeEventPop();
            }}
            data={calendarInfo}
          />
        </>
      </BrowserRouter>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
}

let badgeCount = 0;
export function incrementBadgeCount() {
  badgeCount++;
  console.log("Badge count: ", badgeCount);
}
