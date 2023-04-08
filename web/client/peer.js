function PeerConnection(Socket) {
    this.Socket = Socket;
    this.peerConnection = new RTCPeerConnection({iceServers:[{url:"stun:stun.l.google.com:19302"}]});
    this.peerConnection.onnegotiationneeded = async () => {
        this.makeCall();
    };
    this.makeCall = async function() {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.Socket.send({type: enums.server.clientConnectionStatus.offer, sdp: offer});
    }
    this.handleAnswer = async function (answer) {
        await this.peerConnection.setRemoteDescription(answer);
    }
    this.handleCandidate = async function (candidate) {
        if (!candidate.candidate) {
            await this.peerConnection.addIceCandidate(null);
        } else {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }

    this.setDataChannel = function(dataChannel) {
        console.log("ondatachannel")
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

    this.onicecandidate = function (e) {
        console.log(e);
        const message = {
            type: enums.server.clientConnectionStatus.candidate,
            candidate: null
        };
        if (e.candidate) {
            message.candidate = e.candidate.candidate;
            message.sdpMid = e.candidate.sdpMid;
            message.sdpMLineIndex = e.candidate.sdpMLineIndex;
            this.Socket.send(message)
        }
    }
    this.setDataChannel(
        this.peerConnection.createDataChannel("data", {
            ordered: true,
        })
    );
    
    this.peerConnection.onIceConnectionStateChanged = (event) => {
        console.log("onIceConnectionStateChanged", event);
    };
    this.peerConnection.onLocalIceCandidate = (event) => {
        console.log("onLocalIceCandidate", event);
        this.onicecandidate(event)
    };
    this.peerConnection.onicecandidate = (e) => { this.onicecandidate(e) };

 
}