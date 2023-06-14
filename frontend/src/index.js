import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import PWAPrompt from 'react-ios-pwa-prompt';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <PWAPrompt promptOnVisit={1} timesToShow={3} copyClosePrompt="Close" permanentlyHideOnDismiss={false}/>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
