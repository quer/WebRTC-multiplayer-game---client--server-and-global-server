function Socket() {
    this.serverURL = "ws://localhost:3000?server=1";

    this.ws;
    this.id;
    this.connections = new Map();

    this.ws = new WebSocket(this.serverURL);
    this.ws.onmessage = (message) => {
        console.log(`Global Server -> Server: ${message.data}`);
        this.onServerMessage(JSON.parse(message.data));
    };
    this.send = function(msg) {
        const data = JSON.stringify(msg);
        console.log(`Server -> Global Server: ${data}`);
        this.ws.send(data);
    }
    
    this.onServerMessage = function(msg) {
        console.log(msg);
        switch (msg.type) {
            case enums.server.status.NewServerSetting:
                this.serrveID = msg.id;
                break;
            case enums.server.clientConnectionStatus.offer:
                var clientPeer = new PeerConnection(this, msg.clientID);
                clients.push({id: msg.clientID, pc: clientPeer});
                clientPeer.handleOffer(msg.sdp); 
                break;
            case enums.server.clientConnectionStatus.candidate:
                var clientObj = GetClient(msg.clientID);
                if(clientObj != null){
                    clientObj.pc.handleCandidate(msg);
                }else{
                    console.log("candidate: user doent exist");
                }
            break;
            default:
                break;
        }
        
    }

}