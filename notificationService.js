const taskManager = require('./app.js');

let now, time;

exports.notifyClient = function(client) {
	now = new Date().getTime();
	taskManager.getAllTasks(function(results) {
		results.forEach(function(task) {
			time = new Date(task.time).getTime();
			if(Math.abs(time - now) <= 6015) client.emit('taskNotif', task);
		});
	});
}