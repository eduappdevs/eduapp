import React from "react";
import "./Loader.css";

/**
 * The app's loader animation.
 */
export default function Loader() {
  return (
    <div className="loader__main-container" id="loader_main-container">
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

/**
 * Makes the animation appear.
 */
export function runOpenAnimation() {
  const loader = document.getElementById("loader_main-container");

  loader.style.opacity = "1";
  loader.style.display = "block";
}

/**
 * Makes the animation disappear.
 */
export function runCloseAnimation() {
  const loader = document.getElementById("loader_main-container");

  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 100);
}
