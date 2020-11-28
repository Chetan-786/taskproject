var mysql = require('mysql');
var config = require('./config');

const db = mysql.createConnection(config.development.database);

db.connect((err) => {
    if (err) throw err // console.log(err);
    console.log("Connected to sql!!")
})


module.exports = db;