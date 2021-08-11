import React, { useState, useRef } from "react";
import Setup from "./Setup.js";
import Pregame from "./Pregame.js";
import Ingame from "./Ingame.js";
import "./style.css";

function App() {
    const [phrase, setPhrase] = useState("Setup");
    const roomId = useRef();
    const playerId = useRef();
    const playerSide = useRef();
    const playerName = useRef();
    const changePhrase = (newPhrase) => {
        setPhrase(newPhrase);
    };

    const getPlayerInfor = (
        newRoomId,
        newPlayerId,
        newPlayerSide,
        newPlayerName
    ) => {
        roomId.current = newRoomId;
        playerId.current = newPlayerId;
        playerSide.current = newPlayerSide;
        playerName.current = newPlayerName;
    };

    if (phrase === "Setup") {
        roomId.current = "";
        playerId.current = "";
        playerName.current = "";
        return (
            <Setup
                getPlayerInfor={getPlayerInfor}
                changePhrase={changePhrase}
            />
        );
    }

    if (phrase === "Pregame") {
        console.log("---------------------------------------------------");
        console.log("Pregame");
        console.log("---------------------------------------------------");
        return (
            <Pregame
                changePhrase={changePhrase}
                roomId={roomId.current}
                playerId={playerId.current}
                playerSide={playerSide.current}
                playerName={playerName.current}
            />
        );
    }
    if (phrase === "Ingame") {
        console.log("---------------------------------------------------");
        console.log("Ingame");
        console.log("---------------------------------------------------");
        return (
            <Ingame
                changePhrase={changePhrase}
                roomId={roomId.current}
                playerId={playerId.current}
                playerSide={playerSide.current}
                playerName={playerName.current}
            />
        );
    }
}

export default App;
