import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./views/resources/resources";
import LoginSignup from "./views/loginSignup/loginSignup";
import Home from "./views/home/Home";
<<<<<<< HEAD
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
=======
import React, { Component } from "react";
import Event from "./views/Calendar/event";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {},
    };
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route exact path="/access" element={<LoginSignup />} />
            <Route
              exact
              path="/"
              element={
                this.state.loggedInStatus === "LOGGED_IN" ? (
                  <Home />
                ) : (
                  <Navigate to="/access" />
                )
              }
            />
            <Route
              exact
              path="/resources"
              element={
                this.state.loggedInStatus === "LOGGED_IN" ? (
                  <Resources />
                ) : (
                  <Navigate to="/access" />
                )
              }
            />
            <Route path="/testEvent" element={<Event />} />
            <Route path="/test" element={<Resources />} />
            <Route path = "/testHome" element={<Home/>}/>
>>>>>>> 5b36cc02584eda18b440846feaec1d969eefabde
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
