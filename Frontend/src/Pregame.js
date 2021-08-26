import React, { useState, useRef, useEffect } from "react";
import Board from "./components/Board.js";

import {
    getPlayerName,
    readyCheckRequest,
    setThisPlayerReady,
    setThisPlayerUnready,
} from "./fetchAPI.js";
import {
    WIDTH,
    HEIGHT,
    SHIPTOTAL,
    UNMARKED,
    SHIP,
    COLOR,
    INGAME,
    FRIENDLY,
} from "constant";

export default function Pregame({
    changePhrase,
    roomId,
    playerId,
    playerSide,
}) {
    const [playersName, setPlayersName] = useState({});
    const [myBoard, setMyBoard] = useState({
        availableShipCount: SHIPTOTAL,
        map: Array(81).fill(UNMARKED),
    });
    const [containerAnimation, setContainerAnimation] = useState();

    const isThisPlayerReady = useRef(false);
    const cellClickable = useRef(true);

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

    const cellOnClick = (x, y) => {
        if (!cellClickable.current) return;
        if (
            myBoard.availableShipCount > 0 &&
            myBoard.map[y + x * WIDTH] === UNMARKED
        ) {
            updateMyMap(x, y, UNMARKED);
            return;
        }
        if (myBoard.map[y + x * WIDTH] === SHIP) {
            updateMyMap(x, y, SHIP);
            return;
        }
    };

    const updateMyMap = (x, y, val) => {
        let myNewBoard = {
            availableShipCount: myBoard.availableShipCount,
            map: myBoard.map,
        };
        if (val === UNMARKED) {
            myNewBoard.availableShipCount--;
            myNewBoard.map[y + x * WIDTH] = SHIP;
            console.log(`Location[${y + x * WIDTH}] has been occupied`);
        }
        if (val === SHIP) {
            myNewBoard.availableShipCount++;
            myNewBoard.map[y + x * WIDTH] = UNMARKED;
            console.log(`Location[${y + x * WIDTH}] has been unoccupied`);
        }
        setMyBoard(myNewBoard);
    };

    const getCellColor = (x, y) => {
        return COLOR[myBoard.map[y + x * WIDTH]][FRIENDLY];
    };

    const waitUntilEveryPlayerIsReady = async () => {
        if (!isThisPlayerReady.current) {
            console.log("Cancel ready");
            return;
        }

        let { isEveryPlayerReady } = await readyCheckRequest(roomId);
        if (isEveryPlayerReady) {
            setContainerAnimation({
                animation: "backOutDown 1s",
                animationFillMode: "forwards",
            });
            setTimeout(() => changePhrase(INGAME), 1000);
        } else {
            console.log("Waiting");
            setTimeout(waitUntilEveryPlayerIsReady, 500);
        }
    };

    const toggleReady = async (e) => {
        if (myBoard.availableShipCount !== 0) {
            return;
        }
        isThisPlayerReady.current = !isThisPlayerReady.current;
        cellClickable.current = !cellClickable.current;
        if (isThisPlayerReady.current) {
            e.target.innerHTML = "Cancel";
            e.target.style.color = "white";
            e.target.style.backgroundColor = "rgb(255, 0, 0)";
            await setThisPlayerReady(roomId, playerId, myBoard.map);
            waitUntilEveryPlayerIsReady();
        }
        if (!isThisPlayerReady.current) {
            e.target.innerHTML = "Ready";
            e.target.style.color = "black";
            e.target.style.backgroundColor = "rgb(0, 255, 0)";
            await setThisPlayerUnready(roomId, playerId);
        }
    };
    
    return (
        <>
            <div id="gameContainer" style={containerAnimation}>
                <div className="barContainer">
                    <div
                        className="playerNameContainer"
                        style={
                            playerSide === "Left" ? { fontWeight: "bold" } : {}
                        }
                    >
                        {playersName.Left}
                    </div>
                    <div className="tracker">VS</div>
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
                    <div id="notif">
                        Remaining Ship: {myBoard.availableShipCount}
                    </div>
                    <div>
                        <button
                            id="controlBtn"
                            onClick={toggleReady}
                            style={
                                myBoard.availableShipCount
                                    ? {
                                          backgroundColor: "gray",
                                          cursor: "not-allowed",
                                      }
                                    : {}
                            }
                            disabled={myBoard.availableShipCount}
                        >
                            Ready
                        </button>
                    </div>
                </div>
                <div className="boardContainer">
                    <Board
                        WIDTH={WIDTH}
                        HEIGHT={HEIGHT}
                        side={playerSide}
                        cellOnClick={cellOnClick}
                        getCellColor={getCellColor}
                    />
                </div>
            </div>
        </>
    );
}
