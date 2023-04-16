import React from "react";
import { useNavigate } from "react-router-dom";
import "./HelpPopup.css"

const HelpPopup = props => {
    const navigate = useNavigate()
    return(
        <>
        <div className="popup-container">
            <div className="popup">
                <button className="popup-close-button" onClick={props.handleClose}>X</button>
                <span className="popup-title-text">Help</span>
                
                <div className="help-wrapper">
                    <li className="popup-help-text">
                        <img className="help-icon" src={require("../../icons/hand-icon.png")}></img>
                        Grab Tool - Allows you to grab tokens without accidentally painting spaces
                    </li>
                    <li className="popup-help-text">
                    <img className="help-icon" src={require("../../icons/paint icon.png")}></img>
                        Paint Tool - Select a color/image from the tile bar and click on a space to paint it
                    </li>
                    <li className="popup-help-text">
                    <img className="help-icon" src={require("../../icons/fill-bucket-icon.png")}></img>
                        Paint Tool - Select a color/image from the tile bar and click on any two spaces to paint everything
                        in between
                    </li>
                    <li className="popup-help-text">
                    <img className="help-icon" src={require("../../icons/eraser-icon.png")}></img>
                        Eraser Tool - Click any space to revert it back to being white
                    </li>
                </div>
            </div>
        </div>
        </>
    );
    
}

export default HelpPopup;