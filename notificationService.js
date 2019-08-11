const taskManager = require('./app.js');

let now, time;

exports.notifyClient = function(client, notified) {
	now = new Date().getTime();
	taskManager.getAllTasks(function(results) {
		results.forEach(function(task) {
			time = new Date(task.time).getTime();
			if(Math.abs(time - now) <= 6015 && !notified.includes(task.id)) {
				client.emit('taskNotif', task);
				notified.push(task.id);
			}
		});
	});
}
