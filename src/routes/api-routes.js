const express = require("express");
const csrf = require("csurf");
const validator = require("../middlewares/validator");
const schemas = require("../schemas");
const { ApiController } = require("../controllers");
const customSecretProtection = require("../middlewares/customSecretProtection");

var csrfProtection = csrf({ cookie: true });

const apiRouter = express.Router();

apiRouter.get("/", ApiController.helloWorldHandler);

apiRouter.get("/sensordata/count", ApiController.getAllSensorDataCountHandler);

apiRouter.get("/device/status", ApiController.getDeviceStatusHandler);

apiRouter.delete(
  "/sensordata/all",
  customSecretProtection,
  ApiController.clearCollectionHandler
);

apiRouter.get("/sensordata/all", ApiController.getAllSensorData);
apiRouter.get("/sensordata/latest", ApiController.getLatestSensorDataHandler);

module.exports = apiRouter;
