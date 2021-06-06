const mongoose = require("mongoose");

const MiscDataSchema = new mongoose.Schema(
  {
    motor: { type: Object, required: true },
    sensor: { type: Object, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    collection: "miscdata",
  }
);

const model = mongoose.model("MiscDataModel", MiscDataSchema);

module.exports = model;
