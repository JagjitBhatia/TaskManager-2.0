const router = require('./routes.js');
const http = require('http');
const fs = require('fs');
const io = require('socket.io')(http);

let clientList = [];
let count;

fs.access('log.txt', fs.F_OK, (err) => {
	if (err) {
	  count = 0;
	}

	else {
		fs.readFile("log.txt", function(err, buf) {
			if(err) {
				console.log(err);
				return;
			}
			count = parseInt(buf, 10);
			console.log(count);
		  });
	}
});

io.on('connection', function (client) {
	if(client.handshake.query.id == null) {
		console.log("New User: Client " + count);
		clientList.push( 
			{
				id: count,
				socket: client
			}
		);
		client.emit('subscribed', count);
		count++;
	}

	else {
		let clientID = client.handshake.query.id;
		console.log("Returning User: Client " + clientID);
		clientList.push(
			{
				id: clientID,
				socket: client
			}
		)
	}
	client.on('getTasks', function(clientID) {
		
	});
	
});



router.listen(8090);

io.listen(8020);

process.on('exit', function(code) {
	fs.writeFile("log.txt", count, (err) => {
		if (err) console.log(err);
		console.log("Task Server state saved.");
	  });
    return console.log(`Exiting with code ${code}`);
});