
const WebSocket = require('ws');

const PORT = 5000;

const wsServer = new WebSocket.Server({
    port: PORT
});

const rooms = {};

const rooms2 = new Map();

const leave = room => {
    // not present: do nothing
    if(! rooms[room][uuid]) return;

    // if the one exiting is the last one, destroy the room
    if(Object.keys(rooms[room]).length === 1) delete rooms[room];
    // otherwise simply leave the room
    else delete rooms[room][uuid];
  };

wsServer.on('connection', function (socket) {
  
  socket.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  
    // Some feedback on the console
    console.log("A client just connected");

    // Attach some behavior to the incoming socket
    socket.on('message1', function (msg) {
      const { message, meta, room } = msg
      
        // Broadcast that message to all connected clients
        wsServer.clients.forEach(function (client) {
            
            client.send("Someone said: " + msg);
        });

    });
  
  socket.on('message', function connection(message) {

    
    var obj = JSON.parse(message);
        //console.log(obj);
    let room = obj.room;
    let uuid = obj.nickname;


    //##########################################################################################
    if(obj.action === "create") {
      console.log('obj.action === "create"')
      console.log(obj.room)
    socket.room = obj.room;
      wsServer.clients.forEach(function (client) {
        console.log("##################")
        console.log(client.id)
        console.log(client.room)
        if(client.room == obj.room){
          console.log("created room "+ obj.room)
          client.send("joined room " + obj.room)
          //client.send(obj.username);
        }
        
      });
    }
    
    //##########################################################################################
    if(obj.action === "join") {
      console.log('obj.action === "join"')
      
      const roomExist = false;
      wsServer.clients.forEach(function (client) {
      
        if(client.room == obj.room){
         
          roomExist = true;
        }
        
        
      });
      
      if(roomExist){
         console.log("joined room: " + obj.room);
          socket.room = obj.room;
      }else{
        console.log("Room " + obj.room + " does not exist.");
        socket.send("room does not exist");
      }
      
      
      wsServer.clients.forEach(function (client) {
        if(socket.room == obj.room){
          client.send("joined room " + obj.room)
          //client.send(obj.username);
        }
        console.log("##################")
        console.log(client.id)
        console.log(client.room)
      });
      
      
      
      if(!rooms2[room]){
        console.log("create the room 2");
        rooms2.set(room, []);
      }
      if(! rooms2.get(room)[uuid]){
        console.log("join the room 2");
        rooms2.get(room).push(socket); // join the room
      }
      
      if(! rooms[room]){ 
        console.log("create the room");
        rooms[room] = {};
      }// create the room
      if(! rooms[room][uuid]){ 
       console.log("join the room");
        rooms[room][uuid] = socket; // join the room
        rooms[room][uuid+"1"] = socket; // join the room
      }

    }
    //##########################################################################################
    else if(obj.action === "leave") {
      leave(room);
    }
    //##########################################################################################
    else if(obj.action == "send"){
      console.log("obj.action == send")
      
      //console.log(rooms2.get(room).length)
      console.log(rooms2.length);
      
      
      wsServer.clients.forEach(function (client) {
        if(socket.room == obj.room){
          //client.send("Username = ")
          //client.send(obj.username);
        }
        console.log("##################")
        console.log(client.id)
        console.log(client.room)
      });
      
      /*rooms2.get(room).forEach(function (client) {
        
        console.log("hello")
        
         //console.log(client);
        client.send("obj.message")
      });*/
      
      
    }
    //##########################################################################################
    //START GAME
    if(obj.action === "start"){
      console.log("Start game")
      wsServer.clients.forEach(function (client) {
            
            client.send('{"action":"start"}');
            //client.send("Someone said: " + obj.message);
          //client.send("Someone said: " + "ASD_123");
        });
      
    }
    //##########################################################################################
    //START GAME
    if(obj.action === "word"){
      console.log("Start game")
      wsServer.clients.forEach(function (client) {
            if(socket.room == obj.room){
          client.send('{"action":"word", "word": "1"}');
          
        }
            
        });
      
    }
    

    
      
        // Broadcast that message to all connected clients
        wsServer.clients.forEach(function (client) {
            
            //client.send("test");
            //client.send("Someone said: " + obj.message);
          //client.send("Someone said: " + "ASD_123");
        });

    });

    socket.on('close', function () {
        console.log('Client disconnected');
    })

});

console.log( (new Date()) + " Server is listening on port " + PORT);