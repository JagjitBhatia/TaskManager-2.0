const mysql = require('mysql');

const con = mysql.createConnection({
	host: "hostname",
	user: "username",
	password: "password",
	port: 3306,
	database: "TaskManagerDB"
});

con.connect(function(err) {
	if(err) throw err;
})

module.exports = con;