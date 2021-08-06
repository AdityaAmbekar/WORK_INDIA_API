const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./db.js')
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64'); // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.post('/app/sites', async (req, res) => {

  const id = req.body.id
  const website = req.body.website
  const username = req.body.username
  console.log(username, req.body.password)
  const password =  encrypt(req.body.password);

  const rows = await db.query(
    `INSERT INTO details values (?, ?, ?, ?)`, 
    [id, website, username, password]
  );
  
  return res.json({status: "success"})
});

app.get('/app/sites/list', async(req, res) => {

    const id = req.headers.id;
    var finalResult = []
    const rows = await db.query(
      `SELECT * FROM details where id = ?`, [id], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        
        result.forEach( x => {
          finalResult.push({
            "id": x.id,
            "website": x.website,
            "username": x.username,
            "password": decrypt(x.password)
          })
        });
        return res.json({"list": finalResult})
      });

});

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});