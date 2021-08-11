// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import "./popup.css";

export default function Popup(props) {
    return props.trigger ? (
        <div className="popup">
            <div className="popupInner">{props.children}</div>
        </div>
    ) : (
        ""
    );
}
