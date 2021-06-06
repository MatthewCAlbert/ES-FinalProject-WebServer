const mqtt = require("mqtt");
const SensorData = require("../models/SensorData");
const MiscData = require("../models/MiscData");

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "mqtt://" + process.env.MQTT_HOST;
    this.username = process.env.MQTT_USER;
    this.password = process.env.MQTT_PASSWORD;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password,
    });

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe("es/data", { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on("message", function (topic, message) {
      if (topic === "es/data") {
        let data = JSON.parse(message.toString());
        // console.log(data[0]);
        // return;
        if (data) {
          // Add to db
          if (
            data.info &&
            data.info.motor &&
            data.info.sensor &&
            data.info.timestamp
          ) {
            MiscData.create({
              timestamp: data.info.timestamp,
              sensor: data.info.sensor,
              motor: data.info.motor,
            });
          }
          if (data.sensor && data.sensor.data) {
            let sensorDataCollection = data["sensor"]["data"].reverse();
            let collectedData = [];
            sensorDataCollection.forEach((element) => {
              let sensor = {
                timestamp: element.timestamp,
                rssi: element.rssi,
                temperature: element.data.temperature,
                humidity: element.data.humidity,
                luminance: element.data.luminance,
                wetness: element.data.wetness,
              };
              collectedData.push(sensor);
            });

            SensorData.create(collectedData);
          }
        }
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  sendCommand(command) {
    return this.mqttClient.publish(
      "es/command",
      JSON.stringify({
        command: command,
      })
    );
  }
}

module.exports = MqttHandler;
