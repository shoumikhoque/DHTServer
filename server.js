var express=require("express");
var http = require("http");
var sensorLib = require("node-dht-sensor");
var bodyParser=require("body-parser")
var app=express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'))
const server = http.createServer(app)
app.get('/',(req,res)=>{
    var sensorResult = sensorLib.read(11,4);
	var data ={
		temp:sensorResult.temperature.toFixed(1),
		humidity:sensorResult.humidity.toFixed(1)
    }
    res.send(data);

});
function showIp() {
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
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});
  
}
showIp();
server.listen(3030, err => {
    if (err) {
        throw err
    }
    console.log('server started on port :3030');
})




