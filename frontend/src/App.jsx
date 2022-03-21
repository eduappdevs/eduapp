import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./views/resources/Resources";
import Login from "./views/login/Login";
import Home from "./views/home/Home";
import React, { useState } from "react";
import requireAuth from "./components/auth/RequireAuth";
import ManagementPanel from "./views/ManagementPanel/ManagementPanel";
import { FetchUserInfo } from "./hooks/FetchUserInfo";
import Loader, { runCloseAnimation } from "./components/loader/Loader";
import Calendar from "./views/Calendar/Calendar";
import ChatMenu from "./views/chat/ChatMenu";
import BottomButtons from "./components/bottomButtons/BottomButtons";
import Navbar from "./components/navbar/Navbar";
import { useEffect } from "react";
import DarkModeChanger from "./components/DarkModeChanger";

export default function App() {
  let userinfo = FetchUserInfo(localStorage.userId);
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);

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
    checkMediaQueries();
    setTimeout(() => {
      runCloseAnimation();
    }, 500);
    DarkModeChanger(localStorage.getItem("darkMode"));
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
        <React.Fragment>
          <Navbar mobile={ItsMobileDevice} />
        </React.Fragment>
        {requireAuth() ? (
          <Routes>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/resources" element={<Resources />} />
            <Route exact path="/calendar" element={<Calendar />} />
            <Route exact path="/chat" element={<ChatMenu />} />
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
        <React.Fragment>
          <BottomButtons mobile={ItsMobileDevice} />
        </React.Fragment>
      </BrowserRouter>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
}
