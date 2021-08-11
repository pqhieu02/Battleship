const constant = require("constant");
const uuid = require("uuid");

class Room {
    constructor() {
        this.players = [
            // {
            //     name: "",
            //     id: "",
            //     side: "",
            //     map: "",
            //     undestroyedShipCount: constant.constant.SHIPTOTAL,
            //     status: "",
            // },
        ];
        this.turn = "Left";
        this.roomStatus = "Waiting"; // Waiting / Pregame/ Ingame / Winner
    }

    addPlayer(name) {
        let playerSide = this.assignSideToThisPlayer();
        let playerId = uuid.v4();
        this.players.push({
            name: name,
            id: playerId,
            side: playerSide,
            map: [],
            undestroyedShipCount: constant.SHIPTOTAL,
            status: "Waiting",
        });

        return { playerId, playerSide };
    }

    assignSideToThisPlayer() {
        for (const side of ["Left", "Right"]) {
            let found = false;
            this.players.forEach((player) => {
                if (player.side === side) {
                    found = true;
                }
            });
            if (!found) return side;
        }
    }

    isEnoughPlayers() {
        if (this.players.length === 2) {
            this.roomStatus = "Pregame";
            return true;
        }

        return false;
    }

    getPlayerNameBySide(side) {
        let playerName;
        this.players.forEach((player) => {
            if (player.side === side) {
                playerName = player.name;
            }
        });
        
        return playerName;
    }

    revealThisLocation(x, y, playerId) {
        let cell;

        this.players.forEach((player) => {
            if (player.id !== playerId) {
                if (player.map[y + x * 9] === constant.SHIP) {
                    player.map[y + x * 9] = constant.DESTROYED_SHIP;
                    player.undestroyedShipCount = --player.undestroyedShipCount;
                } else {
                    player.map[y + x * 9] = constant.WATER;
                }
                cell = player.map[y + x * 9];
            }
        });

        return cell;
    }
}

module.exports = Room;
