import { HOME } from "constant";
import React, { useEffect, useState } from "react";
import { getWinnerName } from "./fetchAPI";

export default function Gameover({ changePhrase, roomId }) {
    const [animation, setAnimation] = useState();
    const [winner, setWinner] = useState();
    
    useEffect(() => {
        const getWinner = async () => {
            let { playerName } = await getWinnerName(roomId);
            setWinner(playerName); 
        }

        getWinner();
    }, [roomId])
    
    const exit = () => {
        setAnimation({
            animation: "zoomOut 1s forwards"
        })
        setTimeout(() => {
            changePhrase(HOME);
        }, 1000);
    }
    
    return (
        <div className="popup" style = {animation}>
            <div className="popupInner">
                <h1><span>GAME OVER</span></h1>
                <p>{winner} wins</p>
                <button onClick={exit}>Exit</button>
            </div>
        </div>
    );
}
