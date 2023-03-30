import React from "react";
import { useNavigate } from "react-router-dom";
import "./HostPrompt.css"

const HostPrompt = props => {
    const navigate = useNavigate()
    return(
        <>
        <div className="popup-container">
            <div className="popup">
                <button className="popup-close-button" onClick={props.handleClose}>X</button>
                <span className="popup-title-text">Enter Host Credentials</span>
                <input className="popup-username-input" placeholder="Username"></input>
                <input className="popup-password-input" placeholder="Password" type={"password"}></input>
                <button className="popup-login-button" onClick={() => navigate('/board-brush/editor')}>Login</button>
            </div>
        </div>
        </>
    );
    
}

export default HostPrompt;