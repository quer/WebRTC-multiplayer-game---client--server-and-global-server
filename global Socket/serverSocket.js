const enums = require('../enum');
var ClientSocket = require('./ClientSocket')
module.exports = function (ws, serverID) {
    this.serverID = serverID;
    this.ws =  ws; // Server WS
    this.players =  [];


    this.send = function (data) {
        if(!('type' in data )){
            console.log("doent sendt whitout a 'type'");
        }
        this.ws.send(JSON.stringify(data));
    }
    this.message = function (data) {
        switch (data.type) {
            case enums.server.clientConnectionStatus.answer:
                var player = this.findPlayer(data.clientID);     
                if(player != null){
                    player.ServerAnswser(data.sdp);
                }else{
                    console.log("answer: player do not exist!");
                }
                break;
            case enums.server.clientConnectionStatus.candidate:
                var player = this.findPlayer(data.clientID);     
                if(player != null){
                    player.ServerCandidate(data);
                }else{
                    console.log("answer: player do not exist!");
                }
            break;
            default:
                break;
        }
    }
    this.AddClient = function (ws) {
        this.players.push(new ClientSocket(this, ws));
    }
    this.findPlayer = function (clientID) {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if(player.id == clientID){
                return player;
            }
        }
        return null;
    }
    this.handleCandidate = function (clientID, data) {
        data.clientID = clientID;
        this.send(data);
    }
    this.ClientSendOffer = function (clientID, offerSdp) {
        this.send({
            type: enums.server.clientConnectionStatus.offer,
            sdp: offerSdp,
            clientID: clientID
        })
    }
    //envent at end to ensure, methode exist before.
    this.ws.on("message", data => {
        console.log(`Server has sent us: ${data}`)
        this.message(JSON.parse(data));
    });
    this.send({ type: enums.server.status.NewServerSetting, id: this.serverID })
}