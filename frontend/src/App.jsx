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

export default function App() {
  const [needsExtras, setNeedsExtras] = useState(false);
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  let userinfo = FetchUserInfo(localStorage.userId);

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
        "/(login|menu|resource/[0-9]+|chat/([a-z]|[A-Z]|[0-9])(.*))$"
      ).test(window.location.href)
    );

    if (new RegExp("/(resource/[0-9]+)$").test(window.location.href)) {
      window.addEventListener("canLoadResource", () => {
        setTimeout(() => {
          runCloseAnimation();
        }, 300);
      });
    } else if (
      new RegExp("/(chat/([a-z]|[A-Z]|[0-9])(.*))$").test(window.location.href)
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
          <Loader />
        </React.Fragment>
        {needsExtras && (
          <React.Fragment>
            <Navbar mobile={ItsMobileDevice} />
          </React.Fragment>
        )}
        {requireAuth() ? (
          <Routes>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/resources" element={<Resources />} />
            <Route path="/resource/:resourceId" element={<OpenedResource />} />
            <Route exact path="/calendar" element={<Calendar />} />
            <Route exact path="/chat" element={<ChatMenu />} />
            <Route path="/chat/:chatId" element={<MainChat />} />
            {userinfo.isAdmin && (
              <Route exact path="/management" element={<ManagementPanel />} />
            )}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
        {needsExtras && (
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
