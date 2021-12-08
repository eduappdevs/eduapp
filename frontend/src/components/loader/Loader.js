import React from "react";
import "./loader.css";
export default function Loader() {
  return (
    <div className="loader__main-container">
      <div className="loader__logo-container">
        <div className="loader__logo-text">
          <div className="loader__logo__text__up">
            <span id="loader__logo__text__e">E</span>
            <span id="loader__logo__text__d">D</span>
            <span id="loader__logo__text__u">U</span>
          </div>

          <div className="loader__logo__text__down">
            <span id="loader__logo__text__a">A</span>
            <span id="loader__logo__text__p">P</span>
            <span id="loader__logo__text__p_2">P</span>
          </div>
        </div>
      </div>
    </div>
  );
}
