var clients = [];
var matchmaker = new Socket();

function GetClient(clientID) {
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        if(client.id == clientID){
            return client;
        }
    }
    return null;
}
function send(data) {
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        if(client.pc != null && client.pc.dataChannel != null){
            client.pc.dataChannel.send(data);
        }else{
            console.log("error sening data!: "+ client.id)
        }
    }
    
}