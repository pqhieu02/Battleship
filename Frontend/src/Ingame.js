/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import Board from "./components/Board.js";

import {
    controlGameTimer,
    getGameTimerAndStatus,
    getGameTurn,
    getMyMap,
    getPlayerName,
    getTimeStamp,
    revealThisCell,
    setGameWinner,
    startNewTimer,
    stopTimer,
} from "./fetchAPI.js";
import {
    SHIPTOTAL,
    WIDTH,
    HEIGHT,
    UNMARKED,
    WATER,
    DESTROYED_SHIP,
    COLOR,
    ENEMY,
    FRIENDLY,
    GAMEOVER,
    PAUSED,
} from "constant";

export default function Ingame({ changePhrase, roomId, playerId, playerSide }) {
    const [myMap, setMyMap] = useState(Array(81).fill(UNMARKED));
    const [enemyMap, setEnemyMap] = useState(Array(81).fill(UNMARKED));
    const [currentGameTurn, setCurrentGameTurn] = useState("Left");
    const [boardSide, setBoardSide] = useState();
    const [playersName, setPlayersName] = useState({});
    const [containersAnimation, setContainersAnimation] = useState({});
    const [timer, setTimer] = useState();
    const [inGameStatus, setInGameStatus] = useState();

    const myShipRemain = useRef(SHIPTOTAL);
    const enemyShipRemain = useRef(SHIPTOTAL);
    const cellClickable = useRef(true);
    const notifContent = useRef();

    const requestToStartNewTimer = async () => {
        await startNewTimer(roomId);
    };

    const requestToStopTimer = async () => {
        await stopTimer(roomId);
    };

    const annouceGameWinner = async (winnerSide) => {
        await setGameWinner(roomId, winnerSide);
    };

    const isInFirstTurn = async () => {
        let { timeStamp } = await getTimeStamp(roomId);
        if (timeStamp === 0) return Promise.resolve(true);
        return Promise.reject(false);
    };

    useEffect(() => {
        const updateGameTurn = async () => {
            let { turn } = await getGameTurn(roomId, playerId);
            setCurrentGameTurn(turn);
        };

        updateGameTurn();
        let itv = setInterval(updateGameTurn, 1000);
        return () => clearInterval(itv);
    }, [playerId, roomId]);

    useEffect(() => {
        const updateGameTimerAndStatus = async () => {
            let { gameTimer, roomStatus } = await getGameTimerAndStatus(roomId);
            if (gameTimer < 0) {
                annouceGameWinner(
                    currentGameTurn === "Left" ? "Right" : "Left"
                );
                setContainersAnimation({
                    gameContainer: {
                        animation: "backOutDown 1s forwards",
                    }
                })
                setTimeout(() => changePhrase(GAMEOVER), 1000)
            }
            setTimer(gameTimer);
            setInGameStatus(roomStatus);
            cellClickable.current = roomStatus === PAUSED ? false : true;
        };

        updateGameTimerAndStatus();
        let itv = setInterval(updateGameTimerAndStatus, 1000);

        return () => clearInterval(itv);
    }, [playerId, roomId]);

    useEffect(() => {
        const updateMyMap = async () => {
            let { map, remains } = await getMyMap(roomId, playerId);
            myShipRemain.current = remains;
            console.log("Current game turn: ", currentGameTurn);
            console.log("MyMap has updated!");
            console.log(`My ship remain: ${myShipRemain.current}`);
            console.log(`Enemy's ship remain: ${enemyShipRemain.current}`);
            console.log("---------------------------------------------------");
            setMyMap(map);
        };

        requestToStopTimer();
        updateMyMap().then(() => {
            if (myShipRemain.current === 0 || enemyShipRemain.current === 0) {
                let winnerSide;
                if (myShipRemain.current === 0) {
                    winnerSide = (playerSide === "Left" ? "Right" : "Left");
                } else {
                    winnerSide = playerSide;
                }
                annouceGameWinner(winnerSide);
                setContainersAnimation({
                    gameContainer: {
                        animation: "backOutDown 1s forwards",
                    }
                })
                setTimeout(() => changePhrase(GAMEOVER), 1000);
            }
        });
    }, [currentGameTurn, playerId, roomId]);

    const getCellColor = (x, y, boardSide) => {
        let map = [];
        let target;

        if (playerSide !== boardSide) {
            map = enemyMap;
            target = ENEMY;
        }
        if (playerSide === boardSide) {
            map = myMap;
            target = FRIENDLY;
        }

        return COLOR[map[y + x * WIDTH]][target];
    };

    const updateEnemyMap = (x, y, val) => {
        let map = [...enemyMap];
        map[y + x * WIDTH] = val;
        setEnemyMap(map);
    };

    const cellOnClick = async (x, y, boardSide) => {
        if (playerSide === boardSide) {
            console.log("Your enemy's board is on the other side!");
            return;
        }
        if (playerSide !== currentGameTurn || cellClickable.current === false) {
            console.log("It is not your turn yet!");
            return;
        }
        if (enemyMap[y + x * WIDTH] !== UNMARKED) {
            console.log("This location has already been revealed");
            return;
        }

        console.log(`You clicked a cell at location[${x}][${y}]`);
        let { cell } = await revealThisCell(roomId, playerId, x, y);
        cellClickable.current = false;
        if (cell === DESTROYED_SHIP) {
            console.log("This location is enemy's ship");
            enemyShipRemain.current--;
            updateEnemyMap(x, y, DESTROYED_SHIP);
        }
        if (cell === WATER) {
            console.log("This location is water!");
            updateEnemyMap(x, y, WATER);
        }
        console.log("---------------------------------------------------");
    };

    const gameTimerController = () => {
        controlGameTimer(roomId, playerId);
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
        if (!currentGameTurn) return;

        const deployAnimations = async () => {
            isInFirstTurn()
                .then(() => {
                    setContainersAnimation(() => {
                        requestToStartNewTimer();
                        cellClickable.current = true;
                        notifContent.current =
                            playersName[currentGameTurn] + "'s Turn";
                        setBoardSide(boardSide === "Left" ? "Right" : "Left");
                        return {
                            board: {
                                animation: "rollIn 1s forwards",
                            },
                            gameTurnNotif: {
                                animation: "flipInX 1s forwards",
                            },
                        };
                    });
                })
                .catch(() => {
                    setTimeout(() => {
                        setContainersAnimation({
                            board: {
                                animation: "rollOut 1s forwards",
                            },
                            gameTurnNotif: {
                                animation: "flipOutX 1s forwards",
                            },
                        });
                        setTimeout(() => {
                            setContainersAnimation(() => {
                                requestToStartNewTimer();
                                cellClickable.current = true;
                                notifContent.current =
                                    playersName[currentGameTurn] + "'s Turn";
                                setBoardSide(
                                    boardSide === "Left" ? "Right" : "Left"
                                );
                                return {
                                    board: {
                                        animation: "rollIn 1s forwards",
                                    },
                                    gameTurnNotif: {
                                        animation: "flipInX 1s forwards",
                                    },
                                };
                            });
                        }, 1000);
                    }, 1500);
                });
        };
        deployAnimations();
    }, [currentGameTurn, playersName]);

    const inPauseStyle = {
        backgroundColor: "rgb(0, 255, 0)",
        color: "black",
    };

    const inGameStyle = {
        backgroundColor: "rgb(255, 0, 0)",
        color: "white",
    };

    return (
        <>
            <div id="gameContainer" style = {containersAnimation.gameContainer}>
                <div className="barContainer">
                    <div
                        className="playerNameContainer"
                        style={
                            playerSide === "Left" ? { fontWeight: "bold" } : {}
                        }
                    >
                        {playersName.Left}
                    </div>
                    <div className="tracker">{timer}</div>
                    <div
                        className="playerNameContainer"
                        style={
                            playerSide === "Right" ? { fontWeight: "bold" } : {}
                        }
                    >
                        {playersName.Right}
                    </div>
                </div>
                <div className="barContainer">
                    <div id="notif" style={containersAnimation.gameTurnNotif}>
                        {notifContent.current}
                    </div>
                    <div>
                        <button
                            id="controlBtn"
                            style={
                                inGameStatus === PAUSED
                                    ? inPauseStyle
                                    : inGameStyle
                            }
                            onClick={gameTimerController}
                        >
                            {inGameStatus === PAUSED ? "Unpause" : "Pause"}
                        </button>
                    </div>
                </div>
                <div
                    className="boardContainer"
                    style={containersAnimation.board}
                >
                    <Board
                        WIDTH={WIDTH}
                        HEIGHT={HEIGHT}
                        side={boardSide}
                        cellOnClick={cellOnClick}
                        getCellColor={getCellColor}
                    />
                </div>
            </div>
        </>
    );
}
