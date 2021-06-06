"use strict";

require("dotenv").config();

const port = process.env.PORT || 5000;
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const schemas = require("./src/schemas");
const validator = require("./src/middlewares/validator");
const MqttHandler = require("./src/utils/MqttHandler");
const customSecretProtection = require("./src/middlewares/customSecretProtection");

mongoose.connect(
  `mongodb://${process.env.MONGOD_HOST}:27017/${process.env.MONGOD_DB}`,
  {
    auth: {
      user: process.env.MONGOD_USER,
      password: process.env.MONGOD_PASS,
    },
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set("debug", true);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("connected");
});

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Init MQTT
const mqttClient = new MqttHandler();
mqttClient.connect();

// Define Routes
const apiRouter = require("./src/routes/api-routes");
const webRouter = require("./src/routes/web-routes");

// Extra
apiRouter.post(
  "/command/send",
  customSecretProtection,
  validator(schemas.sendCommand, "body"),
  (req, res) => {
    let { command } = req.body;
    if (mqttClient.sendCommand(command))
      res.send({ success: true, message: "Command Sent" });
  }
);

app.use("/", webRouter);
app.use("/api", apiRouter);

if (process.env.NODE_ENV === "development") {
  app.use(
    sass({
      src: __dirname + "/src",
      dest: __dirname + "/public",
      outputStyle: "compressed",
      debug: true,
    })
  );
}

app.use(express.static(__dirname + "/public"));
app.set("trust proxy", true);
app.set("views", __dirname + "/src/views");
app.engine("ejs", require("./ejs-extended"));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
