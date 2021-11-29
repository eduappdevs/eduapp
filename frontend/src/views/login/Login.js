import React from "react";
import "./login.css";
import LoginAuth from "../../components/auth/LoginAuth";
import { Component } from "react";
export default class Login extends Component {
  constructor(props) {
    super(props);
    // this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this)
  }

  // handleSuccessfulAuth(data) {
  //   //ToDo update parent component
  //   this.props.history.push("/");
  // }
  render() {
    return (
      <div className="loginSection">
        <div className="loginForm">
          <LoginAuth />
        </div>
        <div className="orange"></div>
        <svg
          className="loginSvg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="var(--orange)"
            fill-opacity="1"
            d="M0,128L60,117.3C120,107,240,85,360,112C480,139,600,213,720,250.7C840,288,960,288,1080,245.3C1200,203,1320,117,1380,74.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
        <div className="footer">
          <div className="logo">
            <img src="./assets/logo.png" alt="" />
          </div>
          <div className="getHelp">
            <p>Need help?</p>
          </div>
        </div>
      </div>
    );
  }
}
