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
            //     undestroyedShipCount: constant.SHIPTOTAL,
            //     timeStamp: 0,
            //     status: "",
            // },
        ];
        this.turn = "Left";
        this.timeStamp = 0;
        this.gameTimer = constant.TIME_EXECUTION;
        this.timerItvId = null;
        this.roomStatus = "Waiting"; // Waiting/ Pregame / Ingame ( Paused ) / winner
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
            timeStamp: 0,
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

    removePlayerById(playerId) {
        this.players.forEach((player) => {
            if (playerId !== player.id) {
                otherPlayers.push(player);
            }
        });
        let newPlayerList = this.players.filter(
            (player) => player.id !== playerId
        );
        this.players = newPlayerList;
    }

    isEnoughPlayers() {
        if (this.players.length === 2) {
            this.roomStatus = constant.PREGAME;
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
                player.timeStamp++;
                if (player.map[y + x * 9] === constant.SHIP) {
                    player.map[y + x * 9] = constant.DESTROYED_SHIP;
                    player.undestroyedShipCount--;
                } else {
                    player.map[y + x * 9] = constant.WATER;
                }
                cell = player.map[y + x * 9];
            }
        });
        return cell;
    }

    resetTimer() {
        this.gameTimer = constant.TIME_EXECUTION;
    }

    startTimer() {
        this.roomStatus = constant.INGAME;
        let itv = setInterval(() => {
            this.gameTimer = Math.max(--this.gameTimer, 0);
        }, 1000);
        this.timerItvId = itv;
    }

    stopTimer() {
        clearTimeout(this.timerItvId);
        this.timerItvId = null;
    }
}

module.exports = Room;
