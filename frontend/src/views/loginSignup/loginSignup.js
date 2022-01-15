import React from "react";
import LoginAuth from "../../components/auth/LoginAuth";
import "./loginSignup.css";

export default function LoginSignup() {
  const changeAccess = (x) => {
    const loginForm = document.getElementsByClassName("login_form")[0];
    const loginButton = document.getElementsByClassName(
      "login_auth_RedirectButton"
    )[0];
    const blue_halfDiv = document.getElementsByClassName("blue_halfDiv")[0];
    const orange_halfDiv = document.getElementsByClassName("orange_halfDiv")[0];
    const access_logo = document.getElementsByClassName("accessPage-logo")[0];

    
  };
  return (
    <div className="accessPageSection">
      <div className="accessPage-logo">
        <img src="\assets\logo.png" alt="" />
      </div>
      <div className="loginContainer">
        <div className="loginDiv">
          
          <LoginAuth />
        </div>
        
      </div>
      <svg
        className="accessPageSvg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="var(--blue)"
          fill-opacity="1"
          d="M0,224L80,197.3C160,171,320,117,480,128C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
      <div className="blue"></div>
      <div className="accessPage_background"></div>
    </div>
  );
}
