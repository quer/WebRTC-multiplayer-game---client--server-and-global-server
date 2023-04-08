var enums = {
    "server": {
        "status": {
            "NewServer": 1,
            "NewServerSetting": 2,
            "NewClient": 3,
            "NewClientReady": 4
        },
        "clientConnectionStatus": {
            "NotReady": 1,
            "ReadyToMakeCall": 2,
            "candidate": 3,
            "offer": 4,
            "answer": 5,
            "bye": 6

        }
    }
}

if(typeof module !== 'undefined'){
    module.exports = enums;
}
