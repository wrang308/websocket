
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
  //console.log(socket);
    // Some feedback on the console
    console.log("A client just connected");

    // Attach some behavior to the incoming socket
    socket.on('message1', function (msg) {
      const { message, meta, room } = msg;
      
      
        //console.log("Received message from client: "  + msg);
        // socket.send("Take this back: " + msg);

      console.log("message = ")
       console.log(message); 
      
        //var obj = JSON.parse(msg);
        //console.log(obj);
      
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
    
    //console.log(room)
    console.log(uuid);
    
    if(obj.type === "join") {
      console.log('obj.type === "join"')
      
      if(!rooms2[room]){
        console.log("create the room 2");
        rooms2.set(room, []);
      }
      if(! rooms2.get(room)[uuid]){
        console.log("join the room 2");
        rooms2.get(room).push(socket); // join the room
        //rooms2[room][uuid+"1"] = socket; // join the room
      }
      
      if(! rooms[room]){ 
        console.log("create the room");
        rooms[room] = {};
        //console.log(rooms[room]);
      }// create the room
      if(! rooms[room][uuid]){ 
       console.log("join the room");
        rooms[room][uuid] = socket; // join the room
        rooms[room][uuid+"1"] = socket; // join the room
        
    
      }
      
      console.log(room);
      //console.log(rooms);
    }
    else if(obj.type === "leave") {
      leave(room);
    }
    else if(obj.type == "send"){
      console.log("obj.type == send")
      //console.log(Object.entries(rooms[room])[0].websocket);
      //console.log(Object.entries(rooms[room]).length);
      //console.log(Object.entries(rooms2[room]).length);
      //Object.entries(rooms[room]).forEach(([, sock]) => console.log(sock));
      //Object.keys(rooms[room]).forEach(socket1 => socket1.send(obj.message))
      /*Object.entries(rooms[room]).forEach(sock => {
      console.log("obj.message")
        console.log(obj.message)
        //console.log(sock)
        sock.send(obj.message)
      });*/
      console.log(rooms2.get(room).length)
      console.log(rooms2.length);
      
      console.log(rooms2.get(room));
      
      rooms2.get(room).forEach(function (client) {
        
        console.log("hello")
        
         console.log(client);
        client.send("obj.message")
      });
      
      
    }
    
    if(obj.message == 'message1'){
      console.log("WHHHHHHHHHHHHAAAAAAAt!!");
    }
    
      
        // Broadcast that message to all connected clients
        wsServer.clients.forEach(function (client) {
            
            //client.send("Someone said: " + obj.message);
          //client.send("Someone said: " + "ASD_123");
        });

    });

    socket.on('close', function () {
        console.log('Client disconnected');
    })

});

console.log( (new Date()) + " Server is listening on port " + PORT);