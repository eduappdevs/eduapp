import React from "react";
import logogeduapp from "../assets/eduappadmin.png";
import * as USER_SERVICE from "../services/user.service";
import "../styles/Initialization.css";

export default function Initialization() {
  const handleSubmit = async (form) => {
    form.preventDefault();

    form = form.target;

    let valid = true;
    if (form.admin_user.value === "" || form.admin_pswd.value === "")
      valid = false;

    if (valid) {
      try {
        await USER_SERVICE.createUser({
          email: form.admin_user.value,
          password: form.admin_pswd.value,
          user_role: "eduapp-admin",
        });
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="init-container">
      <div className="logo init-logo">
        <img src={logogeduapp} alt="eduapplogo" />
      </div>
      <h2>Welcome to Eduapp Administration!</h2>
      <p>Please fill out the following to setup the application.</p>
      <svg
        className="decoration-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="var(--blue)"
          fillOpacity="1"
          d="M0,224L80,197.3C160,171,320,117,480,128C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>
      <form className="init-form" onSubmit={handleSubmit}>
        <h2>Setup</h2>
        <div className="init-form-input">
          <label htmlFor="admin_user">Admin User Email</label>
          <input
            type="email"
            placeholder="admin@eduapp.com"
            name="admin_user"
          />
        </div>
        <div className="init-form-input">
          <label htmlFor="admin_user">&nbsp;Admin Password&nbsp;</label>
          <input type="password" placeholder="********" name="admin_pswd" />
        </div>
        <button type="submit" className="init-form-button">
          Complete Setup
        </button>
      </form>
    </div>
  );
}
