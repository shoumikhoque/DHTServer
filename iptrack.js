module.exports.showIp = function () {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    let p = new Promise((resolve, reject) => {
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
                    resolve(iface.address)
                } else {
                    // this interface has only one ipv4 adress
                    // console.log(iface.address);
                    resolve(iface.address)
                }
                ++alias;
            });
        });
    })
    return p;
}
module.exports.findIp=function(){
    this.showIp().then((ip)=>{
        return ip
    })
}