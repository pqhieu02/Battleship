const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 443;

app.use(cors());
app.use(express.json());

const Room = require("./Room.js");
const Queue = require("./Queue.js");
const uuid = require("uuid");
const { INGAME, PAUSED } = require("constant");

let matchList = {};
let waitingRooms = new Queue();

app.post("/getPlayerName", (req, res) => {
    let { roomId, side } = req.body;
    let match = matchList[roomId];
    
    res.json({
        playerName: match.getPlayerNameBySide(side),
    });
});

app.post("/getTimeStamp", (req, res) => {
    let { roomId } = req.body;
    let match = matchList[roomId];
    
    res.json({
        timeStamp: match.timeStamp,
    })
})

// -------------------------------------------------------- Setup Stage

app.post("/joinRoom", (req, res) => {
    let roomId = waitingRooms.first();
    let { playerName } = req.body;

    if (roomId === null) {
        roomId = uuid.v4();
        waitingRooms.enqueue(roomId);
        matchList[roomId] = new Room();
    }
    let { playerId, playerSide } = matchList[roomId].addPlayer(playerName);
    if (matchList[roomId].isEnoughPlayers()) {
        waitingRooms.dequeue(roomId);
    }
    res.json({
        roomId: roomId,
        playerId: playerId,
        playerSide: playerSide,
    });
});

app.post("/getRoomStatus", (req, res) => {
    let { roomId } = req.body;
    res.json({
        roomStatus: matchList[roomId].roomStatus,
    });
});

app.post("/Cancel", (req, res) => {
    let { roomId, playerId } = req.body;
    let match = matchList[roomId];

    match.removePlayerById(playerId);
    if (matchList[roomId].players.length === 0) {
        waitingRooms.remove(roomId);
        delete matchList[roomId];
    }

    res.json({
        message: "OK",
    });
});

//-------------------------------------------------------- Pregame Stage
app.post("/setReady", (req, res) => {
    let { roomId, playerId, map } = req.body;
    let match = matchList[roomId];

    match.players.forEach((player) => {
        if (player.id === playerId) {
            player.map = map;
            player.status = "Ready";
        }
    });
    res.json();
});

app.post("/setUnready", (req, res) => {
    let { roomId, playerId } = req.body;
    let match = matchList[roomId];

    match.players.forEach((player) => {
        if (player.id === playerId) {
            player.map = [];
            player.status = "Unready";
        }
    });
    res.json();
});

app.post("/readyCheck", (req, res) => {
    let roomId = req.body.roomId;
    let match = matchList[roomId];
    let isEveryPlayerReady = true;

    match.players.forEach((player) => {
        if (player.status !== "Ready") {
            isEveryPlayerReady = false;
        }
    });

    res.json({
        isEveryPlayerReady: isEveryPlayerReady,
    });
});

//-------------------------------------------------------- Ingame Stage

app.post("/getGameTurn", (req, res) => {
    let { roomId } = req.body;
    let match = matchList[roomId];

    match.players.forEach((player) => {
        if (player.timeStamp !== match.timeStamp) {
            player.timeStamp++;
            match.turn = match.turn === "Left" ? "Right" : "Left";
        }
    });

    res.json({
        turn: match.turn,
        gameTimer: match.gameTimer,
    });
});

app.post("/getGameTimerAndStatus", (req, res) => {
    let { roomId } = req.body;
    let match = matchList[roomId];

    res.json({
        gameTimer: match.gameTimer,
        roomStatus: match.roomStatus,
    })
})

app.post("/stopTimer", (req, res) => {
    let { roomId } = req.body;
    let match = matchList[roomId];

    match.stopTimer();

    res.json()
})

app.post("/startNewTimer", (req, res) => {
    let { roomId } = req.body;
    let match = matchList[roomId];

    if (!match.timerItvId) { 
        match.resetTimer();
        match.startTimer();
    }

    res.json()
})

app.post("/controlGameTimer", (req, res) => {
    let { roomId, playerId} = req.body;
    let match = matchList[roomId];

    match.players.forEach((player) => {
        if (player.id === playerId) {
            match.roomStatus = match.roomStatus === INGAME ? PAUSED : INGAME;
            if (match.roomStatus === PAUSED) {
                match.stopTimer();
            } 
            if (match.roomStatus === INGAME) {
                match.startTimer();
            }
        }
    })

    res.json();
})

app.post("/getMyMap", (req, res) => {
    let { roomId, playerId } = req.body;
    let match = matchList[roomId];
    let remains;
    let map;

    match.players.forEach((player) => {
        if (player.id === playerId) {
            remains = player.undestroyedShipCount;
            map = player.map;
        }
    });

    res.json({
        map: map,
        remains: remains,
    });
});

app.post("/revealCell", (req, res) => {
    let { roomId, playerId, x, y } = req.body;
    let match = matchList[roomId];

    match.timeStamp++;
    let cell = match.revealThisLocation(x, y, playerId);

    res.json({
        cell: cell,
    });
});

app.post("/setGameWinner", (req, res) => {
    let { roomId, winnerSide } = req.body;
    let match = matchList[roomId];

    match.stopTimer();
    match.roomStatus = winnerSide;

    res.json();
})

app.post("/getWinnerName", (req, res) => {
    let { roomId } = req.body;
    let match = matchList[roomId];

    let playerName = match.getPlayerNameBySide(match.roomStatus);

    res.json({
        playerName: playerName,
    })
})

//------------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Listening at port http://localhost:${PORT}`);
});
