const taskManager = require('./app.js');

let now, time, to_notify;

exports.notifyClient = function(taskManager, client, notified) {

	now = new Date().getTime();

	taskManager.getAllTasks(function(results) {

		results.forEach(function(task) {

			if(!task.time) continue;

			time = new Date(task.time).getTime();

			if(Math.abs(time - now) <= 6015 && !notified.includes(task.id)) {
				to_notify.push(task)
				notified.push(task.id);
			}
		});

		client.emit('taskNotif', to_notify);
	});
}
