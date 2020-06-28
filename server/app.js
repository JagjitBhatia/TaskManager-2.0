// Local taskdb.js file
const taskdb = require('./taskdb.js');

let db;

exports.init = (sql_params) => {
	db = taskdb.connect(sql_params);
	console.log(db);
};

exports.createTask = function (newTask, response) {
	let name = newTask.name;
	let description = newTask.description;
	let time = newTask.time;
	let completed = 0;
	
	db.query(`INSERT INTO Tasks (name, description, time, completed) VALUES ("${name}", "${description}", "${time}", ${completed})`, function(err, res) {
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
	let completed = updatedTask.completed;

	db.query(`UPDATE Tasks SET name = "${name}", description = "${description}, time = "${time}, completed = ${completed} WHERE id = ${id}`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return respons(err);
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
	})
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
	db.query(`SELECT * FROM Tasks JOIN Users ON Tasks.user_id = Users.id WHERE Users.id AND Users.id = ${id}`, function(err, res) {
		if(err) {
			console.log("error: ", err);
			return response(err);
		}

		else {
			return response(res);
		}
	})
};



