import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SHIPTOTAL } from "constant";
import { joinRoom, getRoomStatus, requestToLeaveRoom } from "./fetchAPI.js";

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
                <span>: (+358) 0468 855 502</span>
            </li>
            <li>
                <FontAwesomeIcon icon={["fas", "envelope"]} />
                <span>: quanghieu221002@gmail.com</span>
            </li>
            <li>
                <FontAwesomeIcon icon={["fas", "globe"]} />
                {/* <span>: <a>www.???.com</a></span> */}
            </li>
        </ul>
    </>
);

export default function Setup({ changePhrase, getPlayerInfor }) {
    const isInFindingGame = useRef(false);
    const roomId = useRef();
    const playerId = useRef();
    const playerSide = useRef();
    const playerName = useRef();

    const [stage, setStage] = useState("");
    const [content, setContent] = useState(howToPlay);

    const waitForGame = async (roomId, playerId, playerSide, playerName) => {
        if (!isInFindingGame.current) return;

        let roomStatus = await getRoomStatus(roomId);
        if (roomStatus === "Pregame") {
            getPlayerInfor(roomId, playerId, playerSide, playerName);
            changePhrase("Pregame");
        } else {
            console.log("Matching");
            setTimeout(
                () => waitForGame(roomId, playerId, playerSide, playerName),
                500
            );
        }
    };

    const find = async () => {
        let roomResponse = await joinRoom(playerName.current);
        roomId.current = roomResponse.roomId;
        playerId.current = roomResponse.playerId;
        playerSide.current = roomResponse.playerSide;
        waitForGame(
            roomResponse.roomId,
            roomResponse.playerId,
            roomResponse.playerSide,
            roomResponse.playerName
        );
    };

    const cancelFinding = async () => {
        requestToLeaveRoom(roomId.current, playerId.current);
        roomId.current = "";
        playerId.current = "";
    };

    const onClick = (e) => {
        if (stage !== "Matching") {
            e.target.innerHTML = "Cancel";
            isInFindingGame.current = true;
            find();
            setStage("Matching");
        }
        if (stage === "Matching") {
            e.target.innerHTML = "Find Game";
            isInFindingGame.current = false;
            cancelFinding();
            setStage("Setup");
        }
    };

    return (
        <>
            <div id="Home">
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
                    >
                        <FontAwesomeIcon icon={["fas", "book"]} />
                    </i>

                    <i>
                        <FontAwesomeIcon icon={["fas", "info-circle"]} />
                    </i>

                    <i
                        onClick={() => {
                            setContent(about);
                        }}
                    >
                        <FontAwesomeIcon icon={["fas", "portrait"]} />
                    </i>
                </div>

                <div id="board">{content}</div>
                <div id="play">
                    <h1>Let's Play</h1>
                    <input
                        type="text"
                        placeholder="Your name"
                        onChange={(e) => {
                            playerName.current = e.target.value;
                        }}
                    ></input>
                    <button onClick={onClick}>Find Game</button>
                </div>
            </div>
        </>
    );
}
