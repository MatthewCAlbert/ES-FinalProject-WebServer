const SensorData = require("../models/SensorData");
const MiscData = require("../models/MiscData");

class ApiController {
  static getAllSensorDataCountHandler = (req, res) => {
    SensorData.countDocuments((err, count) => {
      if (err) {
        res.send({ success: false, error: err });
      }
      res.send({ success: true, count: count });
    });
  };
  static getDeviceStatusHandler = async (req, res) => {
    let response = await MiscData.find().limit(1).sort({ $natural: -1 });
    if (response) {
      res.send({ success: true, data: response });
    } else {
      res.send({ success: false });
    }
  };
  static getLatestSensorDataHandler = async (req, res) => {
    let response = await SensorData.find().limit(1).sort({ $natural: -1 });
    if (response) {
      res.send({ success: true, data: response });
    } else {
      res.send({ success: false });
    }
  };
  static getAllSensorData = async (req, res) => {
    let data = await SensorData.find({}).limit(1200);
    res.send({ success: true, data: data });
  };
  static helloWorldHandler = (req, res) => {
    res.send({ success: true, message: "Hello World" });
  };
  static clearCollectionHandler = async (req, res) => {
    if (process.env.NODE_ENV === "development") {
      const response = await SensorData.deleteMany({});
      res.send(response ? true : false);
    } else {
      res.sendStatus(403);
    }
  };
}

module.exports = ApiController;
