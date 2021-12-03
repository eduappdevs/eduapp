import React from "react";
import LoginAuth from "../../components/auth/LoginAuth";
import Registration from "../../components/auth/Registration";
import "./loginSignup.css";

export default function LoginSignup() {
  const changeAccess = (x) => {
    const registrationForm =
      document.getElementsByClassName("registration_form")[0];
    const loginForm = document.getElementsByClassName("login_form")[0];
    const loginButton = document.getElementsByClassName(
      "login_auth_RedirectButton"
    )[0];
    const signupButton = document.getElementsByClassName(
      "registration_auth_RedirectButton"
    )[0];
    const blue_halfDiv = document.getElementsByClassName("blue_halfDiv")[0];
    const orange_halfDiv = document.getElementsByClassName("orange_halfDiv")[0];
    const access_logo = document.getElementsByClassName("accessPage-logo")[0];

    if (x === "signup") {
      loginButton.style.display = "flex";
      loginForm.style.display = "flex";
      signupButton.style.display = "none";
      if (window.matchMedia("(max-width: 900px)").matches) {
        orange_halfDiv.style.height = "80%";
        blue_halfDiv.style.height = "20%";
        access_logo.style.height = "84.3%";
      } else {
        orange_halfDiv.style.height = "100%";
        blue_halfDiv.style.height = "100%";
      }
      registrationForm.style.display = "none";
    } else if (x === "login") {
      loginButton.style.display = "none";
      loginForm.style.display = "none";
      signupButton.style.display = "flex";
      registrationForm.style.display = "flex";
      if (window.matchMedia("(max-width: 900px)").matches) {
        orange_halfDiv.style.height = "13.7%";
        blue_halfDiv.style.height = "80%";
        access_logo.style.height = "20%";
      } else {
        orange_halfDiv.style.height = "100%";
        blue_halfDiv.style.height = "100%";
      }
    }
  };
  return (
    <div className="accessPageSection">
      <div className="accessPage-logo">
        <img src="\assets\logo.png" alt="" />
      </div>
      <div className="accessPage_loginOrSignup">
        <div className="orange_halfDiv">
          <p className="registration_auth_RedirectButton">
            Don't have an account?{" "}
            <a
              onClick={() => {
                changeAccess("signup");
              }}
            >
              Sign up
            </a>
          </p>
          <LoginAuth />
        </div>
        <div className="blue_halfDiv">
          <p className="login_auth_RedirectButton">
            Already have an account ?
            <a
              onClick={() => {
                changeAccess("login");
              }}
            >
              Sign up
            </a>
          </p>
          <Registration />
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
