import React from "react";
import Registration from "../../components/auth/Registration";
import './signup.css'
export default function Signup() {
  return (
    <div className="signupSection">
    
      <Registration />
  
    <div className="orange"></div>
    <svg
      className="signupSvg"
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
