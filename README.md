# WebRTC multiplayer game - client, server and global server
A WebRTC based server set up. To host a game server, to multi client. Whit socket to join each.
Whit a Server Key, to join from. 

# What is it
It a Peer to Peer, to connect multi client to one Server as P2P, whit a key. Whit a global Socket to make the connections
## Global server ( to connect Peer to Peer )
The folder `global Socket`, is for hosting a node server, to send info between the client and the server. that want to P2P. 

All the have to do, is to `npm i` ( will install `npm i ws`) And then `node main.js` Then it will start the socket on port `3000`;

NOTE: 
 * that current, each key, is just a number that increase, for each server. `ServerList.push(new ServerSocket(ws, ++uniqServerid))` can be change in the line here, in `main.js`
 * each server will be hande in the `serverSocket.js` 
 * each client will be hande in the `ClientSocket.js`, in the scope of the server that was connected. 
 * the part telling if it a server or client, is that paremeter, used on the conncetion on the Socket! 

## Create Server
All what is needed to create a server. Is in folder `web/server`. When running that on a website. it will connect to the Global server socket. as a server. then it will get a `id` from that. Then that is the key that can be used to connect whit.

NOTE: 
 * The key is stored in `matchmaker.serrveID` 
 * a list whit all client p2p connection are stored in `clients` ( see main.js )
 * use the methode `send("Test")` to send the text `Test`  to all connected clients

## Client
ll what is needed to create a server. Is in folder `web/client`. When running that on a website. it will connect to the Global server socket. as a client. But you have to tell what key ( the server key ) to connect to.  that is done by passing it into the constructor of the `Socket` obj. ( see `main.js` for eksamble ).

NOTE:
 * use the methode `send("Test")` to send the text `Test`, to the connected server.

## Note.
The global server, server and client. all see the `enum.js` file, that is in the root folder. So if you move the part to other places. you have change the path, to a better place. 

As i have it there, to ensure that the same enum, value us in all 3 parts. 
It have to be change in 
 * `global Socket/ClientSocket.js`
 * `global Socket/serverSocket.js`
 * `web/server/index.html`
 * `web/client/index.html`