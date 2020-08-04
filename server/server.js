const argv = require('minimist')(process.argv.slice(2))
const router = require('./routes.js')(argv);
const notify = require('./notificationService.js');
const http = require('http');
const fs = require('fs');
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8090;


let notified = [];


io.on('connection', function (client) {
	setInterval(() => {
		notify.notifyClient(router.taskManager, client, notified);
	}, 3000);
});

router.listen(PORT);

io.listen(8020);

