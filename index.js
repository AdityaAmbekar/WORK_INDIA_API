const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./db.js')
// const routes = require("./routes.js")(app)

const bcrypt = require("bcrypt");

// parse requests of content-type: application/json
app.use(bodyParser.json());
// app.use(routes)

app.post('/app/sites', async(req, res) => {

  const id = req.body.id
  const website = req.body.website
  const username = req.body.username
  
  const salt = await bcrypt.genSalt(10);    // now we set user password to hashed password
  const password = await bcrypt.hash(req.body.password, salt);

  const rows = await db.query(
    `INSERT INTO details values (?, ?, ?, ?)`, 
    [id, website, username, password]
  );
  
  return res.json({status: "success"})
});

app.get('/app/sites/list', async(req, res) => {

    const id = req.headers.id;

    const rows = await db.query(
      `SELECT * FROM details where id = ?`, [id], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });  

    return res.json({"list": "rows"})
});

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});