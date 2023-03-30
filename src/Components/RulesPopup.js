import React from "react";
import { useNavigate } from "react-router-dom";
import "./RulesPopup.css"

const RulesPopup = props => {
    const navigate = useNavigate()
    return(
        <>
        <div className="popup-container">
            <div className="popup">
                <button className="popup-close-button" onClick={props.handleClose}>X</button>
                <span className="popup-title-text">Rules</span>
                <li className="popup-rule-text">
                    Lorem ipsum dolor sit amet
                </li>
                <li className="popup-rule-text">
                    consectetur adipiscing elit
                </li>
                <li className="popup-rule-text">
                    sed do eiusmod tempor incididunt
                </li>
            </div>
        </div>
        </>
    );
    
}

export default RulesPopup;