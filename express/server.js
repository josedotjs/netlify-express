"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const mails = [
  {
    key: "biohard",
    value: "alemanzur@hotmail.com",
  },
];

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});
router.get("/another", (req, res) => {});

router.post("/mailer/:id", sendMail);

const sendMail = (req, res, next) => {
  const destinatario = req.params.id;
  const to = mails.find(
    (mail) => mail.key === destinatario.toLowerCase().trim()
  );
  const msg = {
    to: to.value,
    from: "administrador@desarrolladorweb.net",
    subject: `☣️ Nueva consulta desde biohard.com.ar`,
    text: req.body.message,
    html: `${
      req.body.message
    } <p>Enviado el ${new Date().toLocaleString()}</p>`,
  };
  sendgrid
    .send(msg)
    .then(() => res.sendStatus(200))
    .catch((e) => next(e));
};

router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
