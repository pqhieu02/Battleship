import React, { useEffect, useState, useRef } from "react";
import Board from "./components/Board.js";
import Popup from "./components/Popup.js";

import {
    getGameTurn,
    getMyMap,
    getPlayerName,
    revealThisCell,
} from "./fetchAPI.js";
import {
    SHIPTOTAL,
    WIDTH,
    HEIGHT,
    UNMARKED,
    WATER,
    DESTROYED_SHIP,
    COLOR,
} from "constant";

export default function Ingame({ changePhrase, roomId, playerId, playerSide }) {
    const [myMap, setMyMap] = useState(Array(81).fill(UNMARKED));
    const [enemyMap, setEnemyMap] = useState(Array(81).fill(UNMARKED));
    const [currentGameTurn, setCurrentGameTurn] = useState("Left");
    const [playersName, setPlayersName] = useState({});
    const [popupTrigger, setPopupTrigger] = useState(false);

    const myShipRemain = useRef(SHIPTOTAL);
    const enemyShipRemain = useRef(SHIPTOTAL);
    const cellClickable = useRef(true);
    const gameOverContent = useRef("You win!");

    const playerNameContainerStyleWhenInTurn = {
        backgroundColor: "orange",
        border: "5px solid royalblue",
    };
    const playerNameStyleWhenInTurn = {
        animation: "heartBeat 2s infinite",
        display: "inline-block",
    };

    useEffect(() => {
        const requestPlayersName = async () => {
            let leftPlayerName = await getPlayerName(roomId, "Left");
            let rightPlayerName = await getPlayerName(roomId, "Right");
            setPlayersName({
                Left: leftPlayerName,
                Right: rightPlayerName,
            });
        };

        requestPlayersName();
    }, [roomId]);

    useEffect(() => {
        const updateGameTurn = async () => {
            let data = await getGameTurn(roomId, playerId);
            setCurrentGameTurn(data.turn);
            myShipRemain.current = data.myShipRemain;
            enemyShipRemain.current = data.enemyShipRemain;
        };

        updateGameTurn();
        let itv = setInterval(updateGameTurn, 500);
        return () => clearInterval(itv);
    }, [playerId, roomId]);

    useEffect(() => {
        const updateMyMap = async () => {
            let data = await getMyMap(roomId, playerId);
            console.log("Current game turn: ", currentGameTurn);
            console.log("MyMap has updated!");
            console.log(`My ship remain: ${myShipRemain.current}`);
            console.log(`Enemy's ship remain: ${enemyShipRemain.current}`);
            console.log("---------------------------------------------------");
            setMyMap(data.map);
        };

        updateMyMap();
        cellClickable.current = true;

        if (enemyShipRemain.current === 0 || myShipRemain.current === 0) {
            setPopupTrigger(true);
            cellClickable.current = false;

            if (myShipRemain.current === 0) {
                gameOverContent.current = "You lose!";
            }
        }
    }, [currentGameTurn, playerId, roomId]);

    const getCellColor = (x, y, side) => {
        let map = Array(1).fill(UNMARKED);
        let target;

        if (playerSide !== side) {
            map = enemyMap;
            target = "ENEMY";
        }
        if (playerSide === side) {
            map = myMap;
            target = "FRIENDLY";
        }

        return COLOR[map[y + x * 9]][target];
    };

    const updateEnemyMap = (x, y, val) => {
        let map = [...enemyMap];
        map[y + x * 9] = val;
        setEnemyMap(map);
    };

    const cellOnClick = async (x, y, side) => {
        if (playerSide === side) {
            console.log("Your enemy's board is on the other side!");
            return;
        }
        if (playerSide !== currentGameTurn || cellClickable.current === false) {
            console.log("It is not your turn yet!");
            return;
        }
        if (enemyMap[y + x * 9] !== UNMARKED) {
            console.log("This location has already been revealed");
        }

        console.log(`You clicked a cell at location[${x}][${y}]`);
        let { cell } = await revealThisCell(roomId, playerId, x, y);
        cellClickable.current = false;
        if (cell === DESTROYED_SHIP) {
            console.log("This location is enemy's ship");
            updateEnemyMap(x, y, DESTROYED_SHIP);
        }
        if (cell === WATER) {
            console.log("This location is water!");
            updateEnemyMap(x, y, WATER);
        }
        console.log("---------------------------------------------------");
    };

    return (
        <>
            <div style={{ animation: "backInDown 1s" }}>
                <div id="GameBar">
                    <div
                        className="playerNameContainer"
                        style={
                            currentGameTurn === "Left" && popupTrigger !== true
                                ? playerNameContainerStyleWhenInTurn
                                : {}
                        }
                    >
                        <span
                            style={
                                currentGameTurn === "Left" &&
                                popupTrigger !== true
                                    ? playerNameStyleWhenInTurn
                                    : {}
                            }
                        >
                            {playersName.Left}
                        </span>
                    </div>

                    <div id="tracker">{currentGameTurn}</div>

                    <div
                        className="playerNameContainer"
                        style={
                            currentGameTurn === "Right" && popupTrigger !== true
                                ? playerNameContainerStyleWhenInTurn
                                : {}
                        }
                    >
                        <span
                            style={
                                currentGameTurn === "Right" &&
                                popupTrigger !== true
                                    ? playerNameStyleWhenInTurn
                                    : {}
                            }
                        >
                            {playersName.Right}
                        </span>
                    </div>
                </div>
                <Board
                    WIDTH={WIDTH}
                    HEIGHT={HEIGHT}
                    cellOnClick={cellOnClick}
                    getCellColor={getCellColor}
                />
                <div className="popupContainer">
                    <Popup trigger={popupTrigger}>
                        <div id="gameOverPopup">
                            <h1>{gameOverContent.current}</h1>
                            <button onClick={() => changePhrase("Setup")}>
                                Exit
                            </button>
                        </div>
                    </Popup>
                </div>
            </div>
        </>
    );
}
