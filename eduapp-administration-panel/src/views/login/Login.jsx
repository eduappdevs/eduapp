import React, { useEffect } from "react";
import LoginAuth from "../../components/auth/LoginAuth";
import Initialization from "../Initialization";
import * as AUTH_SERVICE from "../../services/auth.service";
import "./Login.css";

export default function Login() {
  const [hasInit, setHasInit] = React.useState(true);

  useEffect(() => {
    if (localStorage.getItem("eduapp_language") === null)
      localStorage.setItem("eduapp_language", "en_en");
    AUTH_SERVICE.hasInit().then((res) => setHasInit(res.data.created));
  }, []);

  return hasInit ? (
    <div className="accessPageSection">
      <div className="loginContainer">
        <div className="loginDiv glass-background">
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
          fillOpacity="1"
          d="M0,224L80,197.3C160,171,320,117,480,128C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
      <div className="blue" />
    </div>
  ) : (
    <Initialization />
  );
}
