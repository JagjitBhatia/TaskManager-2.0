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

module.exports = app;
