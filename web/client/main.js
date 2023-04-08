var peerConnection = null;
var matchmaker = new Socket('2')


//matchmaker.connectPeer("")
function send(data) {
    if(peerConnection != null && peerConnection.dataChannel != null){
        peerConnection.dataChannel.send(data);
    }else{
        console.log("error sening data!")
    }
}