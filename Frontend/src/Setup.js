import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PREGAME, SHIPTOTAL } from "constant";
import { joinRoom, getRoomStatus, requestToLeaveRoom } from "./fetchAPI.js";
import logo from "./image/logo.png";

const howToPlay = (
    <>
        <ul>
            <li>
                The object of this game is to try and sink all of the other
                player's ships before they sink all of your ships. All of the
                other player's ships are somewhere on his/her board.
            </li>
            <br />
            <li>
                In the beginning, each player has {SHIPTOTAL} ships. To set up
                the board, you need to click on any unoccupied square to place a
                ship. No ships may be placed on another ship.
            </li>
            <br />
            <li>
                There are 4 colors to indicate a square on a board:{" "}
                <span style={{ color: "white" }}>white</span> is an unoccupied
                square, <span style={{ color: "lightblue" }}>lightblue</span> is
                one of your ships, a <span style={{ color: "gray" }}>gray</span>{" "}
                square is one of your destroyed ships and a{" "}
                <span style={{ color: "red" }}>red</span> square is one of your
                opponent's destroyed ships.
            </li>
            <br />
            <li>
                Once the game begins, the players may not move the ships and
                have to attack your opponent's board before the timer expires.
                Your opponent also tries to attack your board before the timer
                expires. Neither you nor the other player can see the other's
                board so you must try to guess where the ships are. As soon as
                all of one player's ships have been sunk, the game ends.
            </li>
        </ul>
    </>
);

export default function Setup({ changePhrase, getPlayerInfor }) {
    const [stage, setStage] = useState();
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

    return (
        <>
            <div id="Home" style={animation}>
                <h1 id="gameName">
                    <FontAwesomeIcon icon={["fas", "ship"]} />
                    Battleship
                    <FontAwesomeIcon icon={["fas", "ship"]} />
                </h1>
                <div id="how">HOW TO PLAY</div>

                <div id="infoBoard">{howToPlay}</div>
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
                <div id="footer">
                    <div id = "contactsText">
                        <div>
                            <span>
                                <FontAwesomeIcon icon={["fas", "phone-alt"]} />
                            </span>
                            <span>+358 468 855 503</span>
                        </div>
                        <div>
                            <span>
                                <FontAwesomeIcon icon={["fas", "envelope"]} />
                            </span>
                            <span>quanghieu221002@gmail.com</span>
                        </div>
                    </div>
                    <div id = "contactsLink">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={["fab", "facebook"]} />
                        </a>
                        <a
                            href="https://github.com/pqhieu02"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={["fab", "github"]} />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
