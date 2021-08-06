module.exports = app => {
    const users = require("./model.js");
  
    // Add details
    app.post("/customers", users.create);
  
    // Retrieve all details
    // app.get("/customers", customers.findAll);
  
  };