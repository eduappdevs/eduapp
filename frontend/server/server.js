require("dotenv").config();
const Express = require("express");
const HTTPS = require("https");
const fs = require("fs");
const path = require("path");

const IS_LOCAL = true;

const APP = Express();
const APP_PATH = path.join(__dirname, "..", "build");

APP.use(Express.static(APP_PATH));

APP.get("*", (_, res) => res.sendFile(path.join(APP_PATH, "index.html")));

const CERTS = () => {
  try {
    return {
      key: fs.readFileSync("server/.cert/certificate.key"),
      cert: fs.readFileSync("server/.cert/certificate.crt"),
    };
  } catch (err) {
    console.log("No certificates found.");
  }
};
const PORT =
  (IS_LOCAL ? process.env.EXP_HTTP_PORT : process.env.EXP_HTTPS_PORT) || 4112;
const SERVER = HTTPS.createServer(CERTS(), APP);

(IS_LOCAL ? APP : SERVER).listen(PORT, () =>
  console.log("EduApp Main App is running on port: " + PORT)
);
