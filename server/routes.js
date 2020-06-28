const express = require('express');
const cors = require('cors');
const taskManager = require('./app.js');
const bodyParser = require('body-parser')

const app = express();


app.use(cors());

app.use(bodyParser.json());

app.post('/createTask', function (req, res) {
	taskManager.createTask(req.body.params, function(results) {
		res.send(results);
	});
});

app.put('/updateTask', function (req, res) {
	taskManager.updateTask(req.body.params, function(results) {
		res.send(results);
	});
});

// UPDATE 9/9/19: Fixed /deleteTask API error 
app.delete('/deleteTask', function (req, res) {
	taskManager.deleteTask(req.body.id, function(results) {
		res.send(results);
	});
});

app.get('/getAllTasks', function (req, res) {
	taskManager.getAllTasks(function(results) {
		res.send(results);
	});
});

exports.taskManager = taskManager;

module.exports = (cli_args) => {
	const sql_params = {
		host: cli_args.host,
		user: cli_args.user,
		password: cli_args.password,
		port: cli_args.port
	};

	taskManager.init(sql_params);
	return app;
}
