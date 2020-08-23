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
		if(!results) {
			res.status(401).send({message: "Task does not exist!"});
			return;
		}

		res.status(200).send(results);
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
	taskManager.createUser(req.body.params, function(results) {
		if(!results) {
			res.status(400).send({message: "Username already exists"});
			return;
		}
		
		res.status(200).send(results);
	});
});

app.post('/checkUser', function (req, res) {
	taskManager.checkUser(req.body.params, function(results) {
		if(!results) {
			res.status(401).send({message: "Invalid Credentials!"});
			return;
		}

		res.status(200).send(results);
	})
});

app.get('/getTasksForUser', function (req, res) {
	taskManager.getTasksforUser(req.query.id, function(results) {
		res.status(200).send(results);
	});
});


module.exports = (cli_args) => {
	const sql_params = {
		host: cli_args.host,
		user: cli_args.user,
		password: cli_args.password,
		port: cli_args.port
	};

	taskManager.init(sql_params);
	return {app: app, task_manager: taskManager};
}
