import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./views/resources/resources";
import LoginSignup from "./views/loginSignup/loginSignup";
import Home from "./views/home/Home";
import React from "react";
import requireAuth from "./components/auth/RequireAuth";
import { FetchUserInfo } from "./hooks/FetchUserInfo";
export default function App() {
  return (
    <>
      <BrowserRouter>
        {requireAuth() ? (
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/resources" element={<Resources />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/login" element={<LoginSignup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}
