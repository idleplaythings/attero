ServerConnection =
{
    socket: null,

    connect: function(host)
    {
        console.log("Connecting to: " + host);
        var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket
        ServerConnection.socket = new WS(host);

        ServerConnection.socket.onmessage = ServerConnection.receiveMessage
    },

    sendMessage: function(messageObject)
    {
        if (ServerConnection.socket === null)
            throw new "You should call connect before trying to send a message";

        ServerConnection.socket.send(JSON.stringify(messageObject));
    },

    receiveMessage: function(event)
    {
        var data = JSON.parse(event.data);

        if(data.error) {
            ServerConnection.socket.close();
            console.log(data.error);
        } else {
            console.dir(data);
        }
    }
}
