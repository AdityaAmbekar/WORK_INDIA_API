const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes.js")(app)



// parse requests of content-type: application/json
app.use(bodyParser.json());
// app.use(routes)

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});