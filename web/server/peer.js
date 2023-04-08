function PeerConnection(Socket, clientID) {
    this.Socket = Socket;
    this.clientID = clientID;
    this.peerConnection = new RTCPeerConnection({iceServers:[{url:"stun:stun.l.google.com:19302"}]});

    this.setDataChannel = function(dataChannel) {
        this.dataChannel = dataChannel;
        this.dataChannel.onopen = (e) => {
            console.log("open");
        };
        this.dataChannel.onmessage = (e) => {
            console.log("data", e.data);
        };
        this.dataChannel.onclose = (e) => {
            console.log("close");
        };
    }
    this.handleCandidate = async function (candidate) {
        if (!candidate.candidate) {
            await this.peerConnection.addIceCandidate(null);
        } else {
            
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }
    this.handleOffer = async function (offer) {
        offer = new RTCSessionDescription(offer);
        await this.peerConnection.setRemoteDescription(offer);
      
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.Socket.send({type: enums.server.clientConnectionStatus.answer, sdp: answer, clientID: this.clientID});
    }
    this.onicecandidate = function (e) {
        const message = {
            type: enums.server.clientConnectionStatus.candidate,
            candidate: null,
            clientID: this.clientID
        };
        if (e.candidate) {
            message.candidate = e.candidate.candidate;
            message.sdpMid = e.candidate.sdpMid;
            message.sdpMLineIndex = e.candidate.sdpMLineIndex;
            this.Socket.send(message)
        }
    }
    this.peerConnection.ondatachannel = (event) => {
        console.log("ondatachannel")
        this.setDataChannel(event.channel);
    };
    this.peerConnection.onicecandidate = (e) => { this.onicecandidate(e) };


}