const mysql = require('mysql');

exports.connect = (params) => {
	let mysql_port;

	if(!params.port) mysql_port = 3306;
	else mysql_port = params.port;

	const con = mysql.createConnection({
		host: params.host,
		user: params.user,
		password: params.password,
		port: mysql_port,
		database: 'TaskManagerDB'
	});

	con.connect(function(err) {
		if(err) throw err;
	});

	return con;
};
