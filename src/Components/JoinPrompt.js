import React from "react";
import { useNavigate } from "react-router-dom";
import "./JoinPrompt.css"

const JoinPrompt = props => {
    const navigate = useNavigate()
    return(
        <>
        <div className="popup-container">
            <div className="popup">
                <button className="popup-close-button" onClick={props.handleClose}>X</button>
                <span className="popup-title-text">Enter User Credentials</span>
                <input className="popup-username-input" placeholder="Username"></input>
                <input className="popup-room-input" placeholder="Room Code"></input>
                <button className="popup-login-button" onClick={() => navigate('/board-brush/play')}>Login</button>
            </div>
        </div>
        </>
    );
    
}

export default JoinPrompt;