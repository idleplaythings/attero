ServerConnection =
{
    socket: null,

    connect: function(host)
    {
        console.log("Connecting to: " + host);
        var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
        ServerConnection.socket = new WS(host);

        ServerConnection.socket.onmessage = ServerConnection.receiveMessage;
    },

    sendMessage: function(messageObject)
    {
        if (ServerConnection.socket === null) {
            throw new "You should call connect before trying to send a message";
        }

        ServerConnection.socket.send(JSON.stringify(messageObject));
    },

    receiveMessage: function(event)
    {
        var data = JSON.parse(event.data);
        console.log(data);

        if(data.error) {
            ServerConnection.socket.close();
            console.log(data.error);
        } else {
            if (data.type == "MoveRouteEvent")
                ServerConnection.receiveMoveRoute(data);

            if (data.type == "MoveInterrupt")
                EventDispatcher.dispatch(new MoveInterruptEvent("server", data.eventid, data.routeNumber));

            if (data.type == "EnemySpotted")
                EventDispatcher.dispatch(new EnemySpottedEvent("server", UnitManager.createFromJsonIfNeeded(data.unit)));
        }
    },

    receiveMoveRoute: function(data)
    {
        var unit = window.units[data.payload.unitid];

        if (! unit)
            throw "Unit matching message unitid not found"

        var route = data.payload.route.split(";");
        for (var i in route)
        {
            var details = route[i].split(",");

            route[i] = {
                x:  parseInt(details[0]),
                y:  parseInt(details[1]),
                tf: parseInt(details[2]),
                uf: parseInt(details[3])
            };
        }

        EventDispatcher.dispatch(new MoveEvent("server", unit, route));
    }
};
