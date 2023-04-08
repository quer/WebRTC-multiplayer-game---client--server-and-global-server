
function Socket(ServerID) {
    this.serverURL = "ws://localhost:3000?client="+ServerID;

    this.ServerID = ServerID;
    this.ws;
    this.iceServers;

    this.peer = null
    
    this.ws = new WebSocket(this.serverURL);
    this.ws.onmessage = (message) => {
        console.log(`Global Server -> Client: ${message.data}`);
        this.onServerMessage(JSON.parse(message.data));
    };
    this.send = function(msg) {
        const data = JSON.stringify(msg);
        console.log(`Client -> Global Server: ${data}`);
        this.ws.send(data);
    }
    
    this.onServerMessage = function(msg) {
        console.log(msg);
        switch (msg.type) {
            case enums.server.clientConnectionStatus.ReadyToMakeCall:
                this.peer = new PeerConnection(this);
                peerConnection = this.peer;
                break;
            case enums.server.clientConnectionStatus.answer:
                this.peer.handleAnswer(msg.sdp);
                break;
            case enums.server.clientConnectionStatus.candidate:
                this.peer.handleCandidate(msg);
            default:
                break;
        }
    }
}