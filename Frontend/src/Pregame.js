import React, { useState, useRef, useEffect } from "react";
import Board from "./components/Board.js";

import {
    getPlayerName,
    readyCheckRequest,
    setThisPlayerReady,
    setThisPlayerUnready,
} from "./fetchAPI.js";
import { WIDTH, HEIGHT, SHIPTOTAL, UNMARKED, SHIP, COLOR } from "constant";

export default function Pregame({
    changePhrase,
    roomId,
    playerId,
    playerSide,
}) {
    const [playersName, setPlayersName] = useState({});
    const [myBoard, setMyBoard] = useState({
        shipCount: SHIPTOTAL,
        map: Array(81).fill(UNMARKED),
    });

    const isReady = useRef(false);
    const cellClickable = useRef(true);
    const trackerContent = useRef();
    const trackerStyle = useRef();

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

    const cellOnClick = (x, y, boardSide) => {
        if (playerSide !== boardSide) {
            console.log(`Your playboard is on the other side!`);
            return;
        }
        if (!cellClickable.current) return;
        if (myBoard.shipCount > 0 && myBoard.map[y + x * 9] === UNMARKED) {
            updateMyMap(x, y, UNMARKED);
            return;
        }
        if (myBoard.map[y + x * 9] === SHIP) {
            updateMyMap(x, y, SHIP);
            return;
        }
    };

    const updateMyMap = (x, y, val) => {
        let myNewBoard = {
            shipCount: myBoard.shipCount,
            map: myBoard.map,
        };
        if (val === UNMARKED) {
            myNewBoard.shipCount--;
            myNewBoard.map[y + x * 9] = SHIP;
            console.log(`Location[${y + x * 9}] has been occupied`);
        }
        if (val === SHIP) {
            myNewBoard.shipCount++;
            myNewBoard.map[y + x * 9] = UNMARKED;
            console.log(`Location[${y + x * 9}] has been unoccupied`);
        }
        setMyBoard(myNewBoard);
    };

    const getCellColor = (x, y, boardSide) => {
        if (playerSide !== boardSide) return COLOR[UNMARKED]["FRIENDLY"];
        return COLOR[myBoard.map[y + x * 9]]["FRIENDLY"];
    };

    const setReady = async (e) => {
        if (myBoard.shipCount !== 0) {
            return;
        }

        const waitUntilEveryPlayerIsReady = async () => {
            let isEveryPlayerReady = await readyCheckRequest(roomId);
            if (isEveryPlayerReady) {
                changePhrase("Ingame");
            } else {
                if (!isReady.current) {
                    console.log("Cancel ready");
                    return;
                }
                console.log("Waiting");
                setTimeout(waitUntilEveryPlayerIsReady, 500);
            }
        };

        if (!isReady.current) {
            await setThisPlayerReady(roomId, playerId, myBoard.map);
            e.target.style.backgroundColor = "rgb(0, 254, 0)";
            cellClickable.current = false;
            isReady.current = true;
            waitUntilEveryPlayerIsReady();
            return;
        }
        if (isReady.current) {
            await setThisPlayerUnready(roomId, playerId);
            e.target.style.backgroundColor = "";
            isReady.current = false;
            cellClickable.current = true;
            return;
        }
    };

    if (myBoard.shipCount === 0) {
        trackerContent.current = "Ready";
        trackerStyle.current = {
            cursor: "pointer",
            display: "inline-block",
            animation: "tada 1s infinite",
        };
    } else {
        trackerContent.current = myBoard.shipCount;
        trackerStyle.current = {};
    }

    return (
        <>
            <div id="GameBar">
                <div className="playerNameContainer">
                    <span>{playersName.Left}</span>
                </div>
                <div
                    style={trackerStyle.current}
                    id="tracker"
                    onClick={(e) => setReady(e)}
                >
                    {trackerContent.current}
                </div>
                <div className="playerNameContainer">
                    <span>{playersName.Right}</span>
                </div>
            </div>
            <Board
                WIDTH={WIDTH}
                HEIGHT={HEIGHT}
                cellOnClick={cellOnClick}
                getCellColor={getCellColor}
            />
        </>
    );
}
