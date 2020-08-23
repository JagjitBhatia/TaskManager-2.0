
let now, time, to_notify;

to_notify = [];

exports.notifyClient = function(id, taskManager, client, notified) {

	now = new Date().getTime();


	taskManager.getTasksforUser(id, function(results) {

		results.forEach(function(task) {

			if(task.time) {
				time = new Date(task.time).getTime();

				if(Math.abs(time - now) <= 6015 && !notified.includes(task.id)) {
					to_notify.push(task)
					notified.push(task.id);
					console.log(notified);
				}	
			}

		});

		if(to_notify.length > 0) {
			let repeatNotif = setInterval(() => {client.emit('taskNotif', to_notify);}, 5000);
			
			client.on('tasksReceived', (data) => {
				console.log("RECEIVED -- safe to delete");
				to_notify = [];
				clearInterval(repeatNotif);
			});
		}
	});
};
