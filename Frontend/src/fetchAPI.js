import { BASE_URL } from "constant";

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
    let data = await res.json();
    return data;
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
    let data = await res.json();
    return data.roomStatus;
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
    let data = await res.json();
    return data.isEveryPlayerReady;
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
    let data = await res.json();
    return data;
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
    let data = await res.json();
    return data;
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
    let data = await res.json();
    return data;
}
