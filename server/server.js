const argv = require('minimist')(process.argv.slice(2))
const router = require('./routes.js')(argv);
const notify = require('./notificationService.js');
const http = require('http');
const fs = require('fs');
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8090;


let notified = [];



io.on('connection', function (client) {
	console.log("CONNECTION!!!!!");
	client.emit('id_request', {});
	client.on('subscribed', (id) => {
		setInterval(() => {
			notify.notifyClient(id, router.task_manager, client, notified);
		}, 5000);
	});
});


router.app.listen(PORT);

io.listen(8020);

