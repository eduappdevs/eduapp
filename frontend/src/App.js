import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./views/resources/resources";
import LoginSignup from "./views/loginSignup/loginSignup";
import Home from "./views/home/Home";
import React, { Component } from "react";
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
            <Route path="/test" element={<Resources />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}
