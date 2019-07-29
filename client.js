const io = require('socket.io-client');
const client = io.connect('http://localhost:8020');
const sleep = require('sleep');

let myID;
client.on("subscribed", function(data) {
	console.log("connected!");
	myID = data;
	console.log(myID);
	sleep.sleep(5);
	client.emit('getTasks', myID);
});




