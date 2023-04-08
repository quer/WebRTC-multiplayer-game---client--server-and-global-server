const enums = require('../enum');
module.exports = function (server, ws) {
    this.server = server;
    this.ws = ws;
    this.id = this.ws.id;

    this.FlowInfo = enums.server.clientConnectionStatus.NotReady;
    this.message = function (data) {
        console.log(this.server.serverID + '-' + this.ws.id, data);
        switch (data.type) {
            case enums.server.clientConnectionStatus.offer:
                this.server.ClientSendOffer(this.ws.id, data.sdp);
                break;
            case enums.server.clientConnectionStatus.candidate:
                this.server.handleCandidate(this.ws.id, data);
            break;
            default:
                break;
        }
        this.FlowInfo = data.type;
    }
    this.ServerCandidate = function (data) {
        this.send(data);
    }
    this.ServerAnswser = function (sdp) {
        this.send({type: enums.server.clientConnectionStatus.answer, sdp: sdp})
    }
    this.send = function (data) {
        if(!('type' in data )){
            console.log("doent sendt whitout a 'type'");
        }
        this.ws.send(JSON.stringify(data));
    }
    this.ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
        this.message(JSON.parse(data));
    });
    this.send({ type: enums.server.clientConnectionStatus.ReadyToMakeCall })
    this.FlowInfo = enums.server.clientConnectionStatus.ReadyToMakeCall;
}