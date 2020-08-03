const express = require('express');
const cors = require('cors');
const taskManager = require('./app.js');
const bodyParser = require('body-parser')

const app = express();

const corsOpts = {
	origin: '*',
  
	methods: [
	  'GET',
	  'POST',
	  'DELETE',
	  'PUT'
	],
  
	allowedHeaders: [
	  'Content-Type',
	  'Accept'
	],
  };
  
app.use(cors({origin: true}));


app.use(bodyParser.json());

// REST API Routes for Tasks 

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


// TODO: Create REST API routes for Users 

app.post('/createUser', function (req, res) {
	console.log(req);
	console.log('request received: ', req.body);
	taskManager.createUser(req.body.params, function(results) {
		console.log("READY TO SEND: ", results);
		res.status(200).send(results);
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
