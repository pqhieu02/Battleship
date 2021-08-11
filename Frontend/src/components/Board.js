import React from "react";
import "./board.css";

function Cell({ x, y, side, color, cellOnClick }) {
    const cellStyle = {
        border: "1px solid black",
        gridGap: "0px",
        margin: "0px",
        padding: "15px",
        height: "2vw",
        backgroundColor: color,
        transition: "background-color 0.5s",
        cursor: "pointer",
    };
    return <div style={cellStyle} onClick={() => cellOnClick(x, y, side)} />;
}

function Draw(props) {
    let cell = [];
    for (let i = 0; i < props.WIDTH; i++) {
        for (let j = 0; j < props.HEIGHT; j++) {
            cell.push(
                <Cell
                    {...props}
                    key={i + ":" + j}
                    x={i}
                    y={j}
                    color={props.getCellColor(i, j, props.side)}
                />
            );
        }
    }
    return cell;
}

function Board(props) {
    return (
        <>
            <div className="Board Leftboard">
                <Draw {...props} side={"Left"} />
            </div>
            <div className="Board Rightboard">
                <Draw {...props} side={"Right"} />
            </div>
        </>
    );
}

export default Board;
