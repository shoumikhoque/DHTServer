var sensorLib = require("node-dht-sensor");
var sensorResult = sensorLib.read(11,4);
console.log("Temperature: " + sensorResult.temperature.toFixed(1) + "°  / Humidity: " +  sensorResult.humidity.toFixed(1) + "%");
