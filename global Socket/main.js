const WebSocketServer = require('ws');
const url = require('url');
var ServerSocket = require('./serverSocket')

var ServerList = [];
var uniqServerid = 1; // must be new new 


// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 3000 })
wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

// Creating connection using websocket
wss.on("connection", ( ws, req ) => {
    ws.id = wss.getUniqueID();
    console.log("new client connected: " + ws.id);
    const parameters = url.parse(req.url, true);
    console.log(parameters);

    if(parameters.query.server){
        console.log("Server connection")
        ServerList.push(new ServerSocket(ws, ++uniqServerid))

    }else if(parameters.query.client){
        var serrveID = parameters.query.client;
        console.log("Client connection - server:"+ serrveID)
        var server = FindServer(serrveID);
        if(server != null){
            server.AddClient(ws);
        }else{
            console.log("client whit no valid serverId: "+ serrveID);
        }
    }else{
        console.log("error connection")
    }
    
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});

function FindServer(serverID) {
    for (let i = 0; i < ServerList.length; i++) {
        const server = ServerList[i];
        if(server.serverID == serverID){
            return server;
        }
    }
    return null;
}