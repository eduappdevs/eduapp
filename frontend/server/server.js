require("dotenv").config();
const Express = require("express");
const HTTPS = require("https");
const fs = require("fs");
const path = require("path");

const USING_HTTPS = process.env.USING_HTTPS == "true" ? true : false;

var HTTP = Express();

const PORT = process.env.EXP_PORT || 443;

if (USING_HTTPS && PORT == 443) {
  HTTP.get("*", (req, res) =>
    res.redirect("https://" + req.headers.host + req.url)
  );

  HTTP.listen(PORT);
}

const APP = Express();
const APP_PATH = path.join(__dirname, "..", "build");

APP.use(Express.static(APP_PATH));

APP.get("*", (_, res) => res.sendFile(path.join(APP_PATH, "index.html")));

let SERVER = null;

if (USING_HTTPS) {
  const CERTS = () => {
    try {
      return {
        key: fs.readFileSync(path.join(__dirname, ".cert/eduapp.key")),
        cert: fs.readFileSync(path.join(__dirname, ".cert/eduapp.crt")),
      };
    } catch (err) {
      console.log("No certificates found: " + err);
    }
  };
  SERVER = HTTPS.createServer(CERTS(), APP);
}

(USING_HTTPS ? SERVER : APP).listen(PORT, () =>
  console.log("EduApp Main App is running on port: " + PORT)
);
