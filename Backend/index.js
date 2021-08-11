const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 443;

app.use(cors());
app.use(express.json());

const Room = require("./Room.js");
const Queue = require("./Queue.js");
const uuid = require("uuid");

let matchList = {};
let waitingRooms = new Queue();
let gameTurn = new Queue();
gameTurn.enqueue("Left");

app.post("/getPlayerName", (req, res) => {
    let { roomId, side } = req.body;
    res.json({
        playerName: matchList[roomId].getPlayerNameBySide(side),
    });
});

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
        playerName: playerName,
    });
});

//long polling here
app.post("/getRoomStatus", (req, res) => {
    let { roomId } = req.body;
    res.json({
        roomStatus: matchList[roomId].roomStatus,
    });
});

app.post("/Cancel", (req, res) => {
    let { roomId, playerId } = req.body;
    let newRoom = [];

    matchList[roomId].players.forEach((player) => {
        if (playerId !== player.id) {
            newRoom.push(player);
        }
    });
    matchList[roomId].players = [...newRoom];
    if (matchList[roomId].players.length === 0) {
        waitingRooms.remove(roomId);
        delete matchList[roomId];
    }

    res.json({
        message: "OK",
    });
});

// cancel function need to

//-------------------------------------------------------- Pregame Stage
app.post("/setReady", (req, res) => {
    let { roomId, playerId, map } = req.body;
    matchList[roomId].players.forEach((player) => {
        if (player.id === playerId) {
            player.map = map;
            player.status = "Ready";
        }
    });
    res.json();
});

app.post("/setUnready", (req, res) => {
    let { roomId, playerId } = req.body;
    matchList[roomId].players.forEach((player) => {
        if (player.id === playerId) {
            player.map = [];
            player.status = "Waiting";
        }
    });
    res.json();
});

//longpolling here
app.post("/readyCheck", (req, res) => {
    let roomId = req.body.roomId;
    let isEveryPlayerReady = true;

    matchList[roomId].players.forEach((player) => {
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
    let { roomId, playerId } = req.body;
    let myShipRemain;
    let enemyShipRemain;

    matchList[roomId].turn = gameTurn.first();
    if (gameTurn.size > 1 && playerId !== gameTurn.first()) {
        gameTurn.dequeue();
    }

    matchList[roomId].players.forEach((player) => {
        if (player.id === playerId) {
            myShipRemain = player.undestroyedShipCount;
        } else {
            enemyShipRemain = player.undestroyedShipCount;
        }
    });

    res.json({
        turn: matchList[roomId].turn,
        myShipRemain: myShipRemain,
        enemyShipRemain: enemyShipRemain,
    });
});

app.post("/getMyMap", (req, res) => {
    let { roomId, playerId } = req.body;
    let map;

    matchList[roomId].players.forEach((player) => {
        if (player.id === playerId) {
            map = player.map;
        }
    });
    res.json({
        map: map,
    });
});

app.post("/revealCell", (req, res) => {
    let { roomId, playerId, x, y } = req.body;
    let newTurn = matchList[roomId].turn === "Left" ? "Right" : "Left";

    gameTurn.enqueue(newTurn);
    let cell = matchList[roomId].revealThisLocation(x, y, playerId);

    res.json({
        cell: cell,
    });
});

//------------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Listening at port http://localhost:${PORT}`);
});
