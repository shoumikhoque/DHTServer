let express = require("express"),
    http = require("http"),
    request = require('request'),
    fs = require('fs'),
    mkdirp = require("mkdirp"),
    bodyParser = require("body-parser"),
    sha256 = require('js-sha256'),
    shell = require('shelljs');
let app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
let ipAddr = "10.100.32.142"
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
let text = shell.cat("/proc/cpuinfo")
let username = sha256(text.stdout)
let dir = './keyStore/' + username
let port = 3030;
if (!shell.test('-e', './keyStore/')) {
    shell.mkdir('-p', dir)
}
if (!shell.test('-e', dir)) {
    // console.log(dir);
    shell.mkdir('-p', dir)
}
dir = dir + '/' + username

if (shell.test('-e', dir)) {
    //cert file exists


} else {
    //create cert
    //send request to app.js server
    request({
        uri: "http://10.100.32.30:3000/regPi",
        method: "POST",
        form: {
            piID: username,
            ip: ipAddr,
            username: "pi",
            password: "41414141",
            port: port,
            owner: "Manufacturer",
            dataAccess: [""],
            certificate: "",
            publicKey: ""

        }
    }, function (error, response, body) {
        console.log(body);
    });

}
app.post('/',(req,res)=>{
    console.log(req.body);
    // fs.writeFile('/tmp/hello.txt', 'Hello world!', function(err) {
    //     // If an error occurred, show it and return
    //     if(err) return console.error(err);
    //     // Successfully wrote to the file!
    //   });
    let identity=req.body.identity
    let profilename=req.body.profilename
    let priv=req.body.privatekey
    let publicKey=req.body.publicKey
    fs.writeFileSync(dir,identity,(err)=>{
        if (err){
            console.log(err);
        }
    })
    fs.writeFileSync('./keyStore/' + username+'/'+profilename+'-priv',priv,(err)=>{
        if (err){
            console.log(err);
            
        }
    })
    fs.writeFileSync('./keyStore/' + username+'/'+profilename+'-pub',publicKey,(err)=>{
        if (err){
            console.log(err);
            
        }
    })
    
})

const server = http.createServer(app)
server.listen(port, err => {
    if (err) {
        throw err
    }
    console.log('server started on port :', port);
})