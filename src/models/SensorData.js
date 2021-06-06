const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema(
  {
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    luminance: { type: Number, required: true },
    wetness: { type: Number, required: true },
    rssi: { type: Number, required: true },
    timestamp: { type: Date, required: true, unique: true, dropDups: true },
  },
  {
    collection: "sensordata",
  }
);

const model = mongoose.model("SensorDataModel", SensorDataSchema);

module.exports = model;
