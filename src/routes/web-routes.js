const express = require("express");
const csrf = require("csurf");

const webRouter = express.Router();

var csrfProtection = csrf({ cookie: true });

webRouter.get("/", csrfProtection, (req, res) => {
  res.render("pages/index.ejs", { csrf: req.csrfToken() });
});

module.exports = webRouter;
