var http = require('http');
var fs = require('fs');

//loading the index file .html displayed to the client
var server = http.createServer(function(req, res){
	fs.readFile('./index.html', 'utf-8', function(error, content){
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});

//loading socket.io
var io = require('socket.io').listen(server);

//when client connects, log it in the console
io.sockets.on('connection', function(socket){

	//wait for client to send message to the server
	socket.on('newmessage', function(message){
		console.log(socket.username + ' is sending a new message: ' + message);
		socket.broadcast.emit('newmessage', {username: socket.username, message: message});
	});

	//wait for client username
	socket.on('newuser', function(username){
		socket.username = username;
		console.log(socket.username + ' is now connected');
		socket.broadcast.emit('newuser', socket.username);
	});
});


server.listen(8080);
