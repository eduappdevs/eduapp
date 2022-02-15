import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./views/resources/resources";
import Login from "./views/login/login";
import Home from "./views/home/Home";
import React from "react";
import requireAuth from "./components/auth/RequireAuth";
import ManagementPanel from "./views/ManagementPanel/ManagementPanel";
import { FetchUserInfo } from "./hooks/FetchUserInfo";
import Loader from "./components/loader/Loader";
import Calendar from "./views/Calendar/Calendar";
import ChatMenu from "./views/chat/ChatMenu";

export default function App() {
  let userinfo = FetchUserInfo(localStorage.userId);

  return userinfo ? (
    <BrowserRouter>
      {requireAuth() ? (
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/resources" element={<Resources />} />
          <Route exact path="/calendar" element={<Calendar />} />
          <Route exact path="/chat" element={<ChatMenu />} />
          {userinfo.isAdmin && (
            <Route exact path="/management" element={<ManagementPanel />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  ) : (
    <>
      <Loader />
    </>
  );
}
