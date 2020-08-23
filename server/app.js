const taskdb = require('./taskdb.js');

let db;

function getUserByName(username, response) {
	db.query(`SELECT * FROM Users WHERE username = '${username}'`, function (err, res) {
		if(err) {
			console.log(err);
		}

		console.log("Returning response: ", res);
		return response(res);
	});
}


exports.init = (sql_params) => {
	db = taskdb.connect(sql_params);
};

exports.createUser = function (newUser, response) {
	let username = newUser.username;
	let password = newUser.password;
	let createdUser;

	// Check if username exists
	getUserByName(username, function(result) {
		if(result.length > 0) return response(null);

		db.query(`INSERT INTO Users (username, password) VALUES ("${username}", "${password}")`, function(err, res) {
			if(err) {
				console.log("error: ", err);
				return response(err);
			}
	
			else {
				getUserByName(username, function(result) {
					createdUser = result[0];
					data = {
						id: createdUser.id,
						username: createdUser.username
					}
					return response(data);
				});
			}
		});
	})

	
};

exports.updateUser = function (updatedUser, response) {
	let username = updaatedUser.username;
	let password = updatedUser.password;

	db.query(`UPDATE Users SET name = "${username}", password = "${password}"`, function(err, res) {
		if(err) {
			console.log("err: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	});
};

exports.deleteUser = function (id, response) {
	db.query(`DELETE FROM Users WHERE id = ${id}`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	});
}

exports.getUser = function (userID, response) {
	db.query(`SELECT * FROM Users WHERE id = ${userID}`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	});
}


exports.createTask = function (newTask, response) {
	let id = newTask.id;
	let name = newTask.name;
	let description = newTask.description;
	let time = newTask.time;
	let completed = 0;
	
	db.query(`INSERT INTO Tasks (user_id, name, description, time) VALUES (${id}, "${name}", "${description}", "${time}")`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	});
};

exports.updateTask = function (updatedTask, response) {
	let id = updatedTask.id;
	let name = updatedTask.name;
	let description = updatedTask.description;
	let time = updatedTask.time;
	//let completed = updatedTask.completed;

	db.query(`UPDATE Tasks SET name = "${name}", description = "${description}", time = "${time}" WHERE id = ${id}`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	});
};


exports.deleteTask = function (id, response) {
	db.query(`DELETE FROM Tasks WHERE id = ${id}`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	});
};


exports.getAllTasks = function (response) {
	db.query(`SELECT * FROM Tasks`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	});

	
};

exports.getTasksforUser = function(id, response) {
	db.query(`SELECT Tasks.id, Tasks.name, Tasks.description, Tasks.time FROM Tasks JOIN Users ON Tasks.user_id = Users.id WHERE Users.id AND Users.id = ${id}`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	})
};

exports.checkUser = function(creds, response) {
	db.query(`SELECT * FROM Users WHERE username = '${creds.username}' AND password = '${creds.password}'`, (err, res) => {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			if(res.length < 1) return response(null);
			else {
				data = {id: res[0].id};
				return response(data);
			}
		}
	})
}





