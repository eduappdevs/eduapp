import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Resources from "./views/resources/Resources";
import Login from "./views/login/Login";
import Home from "./views/home/Home";
import requireAuth from "./components/auth/RequireAuth";
import ManagementPanel from "./views/ManagementPanel/ManagementPanel";
import { FetchUserInfo } from "./hooks/FetchUserInfo";
import Loader, { runCloseAnimation } from "./components/loader/Loader";
import Calendar from "./views/Calendar/Calendar";
import ChatMenu from "./views/chat/ChatMenu";
import BottomButtons from "./components/bottomButtons/BottomButtons";
import Navbar from "./components/navbar/Navbar";
import DarkModeChanger from "./components/DarkModeChanger";
import FirebaseStorage from "./utils/FirebaseStorage";
import OpenedResource from "./views/resources/openedResource/OpenedResource";
import MainChat from "./views/chat/mainChat/MainChat";
import Menu from "./views/menu/Menu";
import ProfileSettings from "./views/menu/profileOptions/ProfileSettings";
import MenuSettings from "./views/menu/menu-settings/MenuSettings";
import GroupChatCreate from "./views/chat/createGroupChat/GroupChatCreate";
import DirectChatCreate from "./views/chat/createDirectChat/DirectChatCreate";
import { getOfflineUser } from "./utils/OfflineManager";
import useRole from "./hooks/useRole";

export default function App() {
  const [needsExtras, setNeedsExtras] = useState(false);
  const [needsLoader, setNeedsLoader] = useState(true);
  const [ItsMobileDevice, setItsMobileDevice] = useState(null);

  let userinfo = FetchUserInfo(
    getOfflineUser().user === null ? -1 : getOfflineUser().user.id
  );
  let isAdmin = useRole(userinfo, "eduapp-admin");

  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.innerWidth < 1000) {
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 500);
  };

  useEffect(() => {
    setNeedsExtras(
      !new RegExp(
        "/(login|menu(/.*)?|resource/[0-9]+|chat/([a-z]|[A-Z]|[0-9])(.*))$"
      ).test(window.location.href)
    );

    setNeedsLoader(
      !new RegExp("/(menu(/.*)?|chat/create/(direct|group))$").test(
        window.location.href
      )
    );

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
  }, []);

  useEffect(() => {
    checkMediaQueries();
  }, [window.innerWidth]);

  return userinfo ? (
    <>
      <BrowserRouter>
        <React.Fragment>
          <div style={{ display: needsLoader ? "flex" : "none" }}>
            <Loader />
          </div>
        </React.Fragment>
        {needsExtras && (
          <React.Fragment>
            <Navbar mobile={ItsMobileDevice} />
          </React.Fragment>
        )}
        {requireAuth() ? (
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
            <Route path="/resource/:resourceId" element={<OpenedResource />} />
            <Route path="/chat/:chatId" element={<MainChat />} />
            <Route path="/chat/create/group" element={<GroupChatCreate />} />
            <Route path="/chat/create/direct" element={<DirectChatCreate />} />

            {/* Menu */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/profile" element={<ProfileSettings />} />
            <Route path="/menu/settings" element={<MenuSettings />} />

            {/* Unknown URL Reroute */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
        {needsExtras && ItsMobileDevice && (
          <React.Fragment>
            <BottomButtons mobile={ItsMobileDevice} />
          </React.Fragment>
        )}
      </BrowserRouter>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
}
