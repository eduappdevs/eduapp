require("dotenv").config();
const Express = require("express");
const HTTPS = require("https");
const fs = require("fs");
const path = require("path");

const IS_LOCAL = true;

var HTTP = Express();

//https
// HTTP.get("*", (req, res) =>
//   res.redirect("https://" + req.headers.host + req.url)
// );

//http
// HTTP.listen(80);

const APP = Express();
const APP_PATH = path.join(__dirname, "..", "build");

APP.use(Express.static(APP_PATH));

APP.get("*", (_, res) => res.sendFile(path.join(APP_PATH, "index.html")));

//https
// const CERTS = () => {
//   try {
//     return {
//       key: fs.readFileSync(path.join(__dirname, ".cert/eduapp.key")),
//       cert: fs.readFileSync(path.join(__dirname, ".cert/eduapp.crt")),
//     };
//   } catch (err) {
//     console.log("No certificates found: " + err);
//   }
// };
const PORT = process.env.EXP_PORT || 443;
// const SERVER = HTTPS.createServer(CERTS(), APP);
const SERVER = null;

(IS_LOCAL ? APP : SERVER).listen(PORT, () =>
  console.log("EduApp Admin is running on port: " + PORT)
);
