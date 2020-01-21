var express = require("express");
var http = require("http");
var request = require('request')
var sensorLib = require("node-dht-sensor");
var bodyParser = require("body-parser")
let cp = require('child_process'),
  fs = require('fs'),
  mkdirp = require("mkdirp"),
  ursa = require("ursa");
var app = express();
let port = 3030;
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'))
// Gets hash of cpuinfo

// let ipTrack = require('./iptrack').findIp();
// // ipTrack.then((ip) => {
// //   // console.log("ip address" + ip);
// //   // window.ipAddr=ip
// // });
// console.log(ipTrack);
let ipAddr = "10.100.32.142"
// showIp();
// console.log(ipAddr);





var shell = require('shelljs');
var text = shell.cat("/proc/cpuinfo")
var sha256 = require('sha256')
ID = sha256(text.stdout)
console.log(ID);
var sensorResult = sensorLib.read(11, 4);

const server = http.createServer(app)
setInterval(() => {
  request({
    uri: "http://10.100.32.30:3000/sendData",
    method: "POST",
    form: {
      piID: ID,
      temp: sensorResult.temperature.toFixed(1),
      humidity: sensorResult.humidity.toFixed(1)
    }
  }, function (error, response, body) {
    console.log(body);
  });
}, 5000)
app.get('/', (req, res) => {
  var sensorResult = sensorLib.read(11, 4);
  var data = {
    temp: sensorResult.temperature.toFixed(1),
    humidity: sensorResult.humidity.toFixed(1)
  }
  res.sendFile(__dirname + '/hello.html')
  //res.send(data);

});
server.listen(port, err => {
  if (err) {
    throw err
  }
  console.log('server started on port :', port);
})

function showIp(params) {
  var os = require('os');
  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        // console.log(ifname + ':' + alias, iface.address);
        // return iface.address
      } else {
        // this interface has only one ipv4 adress
        console.log(iface.address);
        return iface.address
      }
      ++alias;
    });
  });
}