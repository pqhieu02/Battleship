import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PREGAME, SHIPTOTAL } from "constant";
import { joinRoom, getRoomStatus, requestToLeaveRoom } from "./fetchAPI.js";
import logo from "./logo.png";

const howToPlay = (
    <>
        <h1>How to Play</h1>
        <ul>
            <li>
                The object of this game is to try and sink all of the other
                player's ship before they sink all of your ships. All of the
                other player's ships are somewhere on his/her board.
            </li>
            <br />

            <li>
                You try and hit them by calling out the coordinates of one of
                the squares on the board. The other player also tries to hit
                your ships by calling out coordinates. Neither you nor the other
                player can see the other's board so you must try to guess where
                they are.
            </li>
            <br />

            <li>
                Each player places the {SHIPTOTAL} ships somewhere on their
                board. No ships may be placed on another ship. Once the guessing
                begins, the players may not move the ships. As soon as all of
                one player's ships have been sunk, the game ends.
            </li>
            <br />
        </ul>
    </>
);
const about = (
    <>
        <h1>Hieu Pham</h1>
        <ul>
            <li>
                <FontAwesomeIcon icon={["fas", "mobile-alt"]} />
                <span>: (+358) 468 855 502</span>
            </li>
            <li>
                <FontAwesomeIcon icon={["fas", "envelope"]} />
                <span>: quanghieu221002@gmail.com</span>
            </li>
        </ul>
    </>
);

export default function Setup({ changePhrase, getPlayerInfor }) {
    const [stage, setStage] = useState();
    const [content, setContent] = useState(howToPlay);
    const [animation, setAnimation] = useState();
    const [playerName, setPlayerName] = useState("");

    const isInFindingGame = useRef(false);
    const roomId = useRef();
    const playerId = useRef();
    const playerSide = useRef();

    const waitForGame = async (roomId, playerId, playerSide) => {
        if (!isInFindingGame.current) return;

        let { roomStatus } = await getRoomStatus(roomId);
        if (roomStatus === PREGAME) {
            getPlayerInfor(roomId, playerId, playerSide);
            setAnimation({
                animation: "fadeOut 1s forwards",
            });
            setTimeout(() => {
                changePhrase(PREGAME);
            }, 1000);
        } else {
            console.log("Matching");
            setTimeout(() => waitForGame(roomId, playerId, playerSide), 500);
        }
    };

    const find = async () => {
        let data = await joinRoom(playerName);
        roomId.current = data.roomId;
        playerId.current = data.playerId;
        playerSide.current = data.playerSide;
        waitForGame(data.roomId, data.playerId, data.playerSide);
    };

    const cancelFinding = async () => {
        requestToLeaveRoom(roomId.current, playerId.current);
        roomId.current = "";
        playerId.current = "";
    };

    const onClick = (e) => {
        if (stage !== "Matching") {
            isInFindingGame.current = true;
            find();
            setStage("Matching");
        }
        if (stage === "Matching") {
            isInFindingGame.current = false;
            cancelFinding();
            setStage("Setup");
        }
    };

    const navOnFocusStyle = {
        opacity: "1",
    };

    return (
        <>
            <div id="Home" style={animation}>
                <h1 id="gameName">
                    <FontAwesomeIcon icon={["fas", "ship"]} />
                    Battleship
                    <FontAwesomeIcon icon={["fas", "ship"]} />
                </h1>
                <div id="nav">
                    <i
                        onClick={() => {
                            setContent(howToPlay);
                        }}
                        style={content === howToPlay ? navOnFocusStyle : {}}
                    >
                        <FontAwesomeIcon icon={["fas", "book"]} />
                    </i>

                    <i
                        onClick={() => {
                            setContent(about);
                        }}
                        style={content === about ? navOnFocusStyle : {}}
                    >
                        <FontAwesomeIcon icon={["fas", "portrait"]} />
                    </i>
                </div>

                <div id="infoBoard">{content}</div>
                <div id="play">
                    <img src={logo} alt="logo"></img>
                    <input
                        type="text"
                        placeholder="Your name (1-10 chars)"
                        onChange={(e) => {
                            setPlayerName(e.target.value);
                        }}
                        maxLength={10}
                    ></input>
                    <button
                        onClick={onClick}
                        style={
                            playerName.length === 0
                                ? { cursor: "not-allowed" }
                                : {}
                        }
                        disabled={playerName.length === 0}
                    >
                        {stage === "Matching" ? "Cancel" : "Find Game"}
                    </button>
                </div>
            </div>
        </>
    );
}
