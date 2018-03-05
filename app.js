var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent'); //blocks html characters
var fs = require('fs');

//loading the page
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket, username){
	//when username is received it is stored as a session variable
	socket.on('newuser', function(username){
		username = ent.encode(username);
		socket.username = username;
		socket.broadcast.emit('newuser', username);
		console.log(username + ' has joined the chat');
	});

	//when message is received the client's username is retrieved
	socket.on('message', function(message){
		message = ent.encode(message);
		socket.broadcast.emit('message', {username: socket.username, 
message: message});
	});
});

server.listen(8080);
