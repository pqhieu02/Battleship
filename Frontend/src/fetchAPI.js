// const BASE_URL = "http://localhost:8080";
const BASE_URL = "http://battleshipbackend-env.eba-fysqfqfq.us-east-2.elasticbeanstalk.com";

export async function joinRoom(playerName) {
    let res = await fetch(BASE_URL + "/joinRoom", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            playerName: playerName,
        }),
    });
    let { roomId, playerId, playerSide } = await res.json();
    return { roomId, playerId, playerSide };
}

export async function getRoomStatus(roomId) {
    let res = await fetch(BASE_URL + "/getRoomStatus", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        }),
    });
    let { roomStatus } = await res.json();
    return { roomStatus };
}

export async function requestToLeaveRoom(roomId, playerId) {
    await fetch(BASE_URL + "/Cancel", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            playerId: playerId,
        }),
    });
}

export async function getPlayerName(roomId, side) {
    let res = await fetch(BASE_URL + "/getPlayerName", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            side: side,
        }),
    });
    let data = await res.json();
    return data.playerName;
}

export async function setThisPlayerReady(roomId, playerId, map) {
    await fetch(BASE_URL + "/setReady", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            playerId: playerId,
            map: map,
        }),
    });
}

export async function readyCheckRequest(roomId) {
    let res = await fetch(BASE_URL + "/readyCheck", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        }),
    });
    let { isEveryPlayerReady } = await res.json();
    return { isEveryPlayerReady };
}

export async function setThisPlayerUnready(roomId, playerId) {
    await fetch(BASE_URL + "/setUnready", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            playerId: playerId,
        }),
    });
}

export async function getGameTurn(roomId, playerId) {
    let res = await fetch(BASE_URL + "/getGameTurn", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            playerId: playerId,
        }),
    });
    let { turn, gameTimer } = await res.json();
    return { turn, gameTimer };
}

export async function getMyMap(roomId, playerId) {
    let res = await fetch(BASE_URL + "/getMyMap", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            playerId: playerId,
        }),
    });
    let { map, remains } = await res.json();
    return { map, remains };
}

export async function revealThisCell(roomId, playerId, x, y) {
    let res = await fetch(BASE_URL + "/revealCell", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            playerId: playerId,
            x: x,
            y: y,
        }),
    });
    let { cell } = await res.json();
    return { cell };
}

export async function getTimeStamp(roomId) {
    let res = await fetch(BASE_URL + "/getTimeStamp", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        })
    })
    let { timeStamp } = await res.json();
    return { timeStamp };
}

export async function getGameTimerAndStatus(roomId) {
    let res = await fetch(BASE_URL + "/getGameTimerAndStatus", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        })
    })
    let { gameTimer, roomStatus } = await res.json();
    return { gameTimer, roomStatus };
}

export async function stopTimer(roomId) {
    await fetch(BASE_URL + "/stopTimer", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        })
    })
}

export async function resumeTimer(roomId) {
    await fetch(BASE_URL + "/resumeTimer", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        })
    })
}

export async function startNewTimer(roomId) {
    await fetch(BASE_URL + "/startNewTimer", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        })
    })
}

export async function setGameWinner(roomId, winnerSide) {
    await fetch(BASE_URL + "/setGameWinner", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            winnerSide: winnerSide,
        })
    })
}

export async function controlGameTimer(roomId, playerId) {
    await fetch(BASE_URL + "/controlGameTimer", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
            playerId: playerId,
        })
    })
}

export async function getWinnerName(roomId) {
    let res = await fetch(BASE_URL + "/getWinnerName", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            roomId: roomId,
        })
    })
    let { playerName } = await res.json();
    return { playerName };
}