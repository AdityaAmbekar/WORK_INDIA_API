const sql = require("./db.js");

// constructor
const User = function(user) {
  this.userid = user.id;
  this.website = user.website;
  this.username = user.username;
  this.password = user.password;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO details SET ?", newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
    //   console.log("created customer: ", { id: res.insertId, ...newCustomer });
      result(null, { id: res.id, ...newUser });
    });
  };

  module.exports = User;