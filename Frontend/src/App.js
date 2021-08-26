import React, { useState, useRef } from "react";
import Setup from "./Setup.js";
import Pregame from "./Pregame.js";
import Ingame from "./Ingame.js";
import Gameover from "./Gameover.js";
import "./style.css";
import { GAMEOVER, HOME, INGAME, PREGAME } from "constant";

function App() {
    const [phrase, setPhrase] = useState(HOME);
    const roomId = useRef();
    const playerId = useRef();
    const playerSide = useRef();
    const changePhrase = (newPhrase) => {
        setPhrase(newPhrase);
    };

    const getPlayerInfor = (newRoomId, newPlayerId, newPlayerSide) => {
        roomId.current = newRoomId;
        playerId.current = newPlayerId;
        playerSide.current = newPlayerSide;
    };

    if (phrase === HOME) {
        roomId.current = "";
        playerId.current = "";
        playerSide.current = "";
        return (
            <Setup
                getPlayerInfor={getPlayerInfor}
                changePhrase={changePhrase}
            />
        );
    }

    if (phrase === PREGAME) {
        console.log("---------------------------------------------------");
        console.log("Pregame");
        console.log("---------------------------------------------------");
        return (
            <Pregame
                changePhrase={changePhrase}
                roomId={roomId.current}
                playerId={playerId.current}
                playerSide={playerSide.current}
            />
        );
    }

    if (phrase === INGAME) {
        console.log("---------------------------------------------------");
        console.log("Ingame");
        console.log("---------------------------------------------------");
        return (
            <Ingame
                changePhrase={changePhrase}
                roomId={roomId.current}
                playerId={playerId.current}
                playerSide={playerSide.current}
            />
        );
    }

    if (phrase === GAMEOVER) {
        return (
            <Gameover
                changePhrase={changePhrase}
                roomId={roomId.current}
                playerId={playerId.current}
                playerSide={playerSide.current}
            />
        );
    }
}

export default App;
