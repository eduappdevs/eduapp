import { BrowserRouter, Routes, Route } from "react-router-dom";
import Resources from "./views/resources/resources";
import Login from "./views/login/Login";
import Welcome from "./views/welcome/Welcome";
import Home from "./views/home/Home";
import Signup from "./views/signUp/Signup";
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
            <Route
              exact
              path="/"
              element={
                this.state.loggedInStatus === "LOGGED_IN" ? (
                  <Home loggedInStatus={this.state.loggedInStatus} />
                ) : (
                  <Welcome loggedInStatus={this.state.loggedInStatus} />
                )
              }
            />
            <Route
              exact
              path="/resources"
              element={<Resources loggedInStatus={this.state.loggedInStatus} />}
            ></Route>
            <Route
              exact
              path="/login"
              element={<Login loggedInStatus={this.state.loggedInStatus} />}
            ></Route>
            <Route
              exact
              path="/signup"
              element={<Signup loggedInStatus={this.state.loggedInStatus} />}
            ></Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}
