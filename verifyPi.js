var cp = require('child_process'),
    fs = require('fs'),
    mkdirp = require("mkdirp"),
    ursa=require("ursa")
    ;
let msg = "piId:4cf527c583e4404648be5975329b18fc90b98bca3eb699dc26390725ac1a7fba"
let username = '4cf527c583e4404648be5975329b18fc90b98bca3eb699dc26390725ac1a7fba'


let dir = './keyStore/' + username

if (fs.existsSync(dir + '/private.pem') && fs.existsSync(dir + '/public.pem')) {
    let privkey = ursa.createPrivateKey(fs.readFileSync(dir + '/private.pem')); // read private key from file
    let encryptedMsg = privkey.privateEncrypt(msg, 'utf8', 'base64'); // Encrypt msg with Private key
    let pubkey = ursa.createPublicKey(fs.readFileSync(dir + '/public.pem')); // read public key from file
    let decryptedMsg = pubkey.publicDecrypt(encryptedMsg, 'base64', 'utf8'); //Decrypt cipher text with Public key

    console.log('original message :', msg)
    console.log('encrypted message :', encryptedMsg, '\n');
    console.log('decrypted msg :', decryptedMsg, '\n');

} else {
    var p = new Promise((resolve, reject) => {
        mkdirp(dir, function (err) {
            if (err) console.log(err);
            console.log("Successfully created" + dir + "  directory");
        });
        cp.exec('openssl genrsa 2048', function (err, privKey, stderr) { // gen private key

            fs.writeFileSync(dir + '/private.pem', privKey);
            // gen coresponding public key                
            cp.exec('openssl rsa -in ' + dir + '/private.pem' + ' -pubout', function (err, pubKey, stderr) {
                fs.writeFileSync(dir + '/public.pem', pubKey);
                status = true
                resolve(status)
            });
        });
    }).then((status) => {
        if (status == true) {
            let privkey = ursa.createPrivateKey(fs.readFileSync(dir + '/private.pem')); // read private key from file
            let encryptedMsg = privkey.privateEncrypt(msg, 'utf8', 'base64'); // Encrypt msg with Private key

            let pubkey = ursa.createPublicKey(fs.readFileSync(dir + '/public.pem')); // read public key from file
            let decryptedMsg = pubkey.publicDecrypt(encryptedMsg, 'base64', 'utf8'); //Decrypt cipher text with Public key

            console.log('original message :', msg)
            console.log('encrypted message :', encryptedMsg, '\n');
            console.log('decrypted msg :', decryptedMsg, '\n');
        }

    })
}