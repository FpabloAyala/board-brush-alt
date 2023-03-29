import { useNavigate } from "react-router-dom";
import './Editor.css'
const Editor = () => {
    const navigate = useNavigate()
    return (
        <>
        <div className="editor-container">
            <div className="editor-tool-bar">
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../icons/save-icon.png")} alt="save icon"/></button>
                <button className="editor-icon-button" onClick={() => navigate('/load')}><img className="editor-tool-icon" src={require("../icons/load-icon.png")} alt="load icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../icons/hand-icon.png")} alt="grab icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../icons/paint icon.png")} alt="paint brush icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../icons/fill-bucket-icon.png")} alt="bucket icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../icons/eraser-icon.png")} alt="eraser icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../icons/type-icon.png")} alt="T icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../icons/ruler-icon.png")} alt="ruler icon"/></button>
            </div>
            <div className="editor-right-side">
                <div className="editor-header-bar">
                    <span className="editor-title">Board Editor</span>
                    <div className="editor-play-button">
                        <span className="editor-start-text">Start Game</span>
                        <img className="editor-play-icon" src={require("../icons/play-icon-green.png")} alt="play button"/>
                    </div>

                    <span className="editor-grid-text">Grid Size:</span>
                    <input className='editor-size-input'></input>
                    <span className="editor-grid-text">X</span>
                    <input className='editor-size-input'></input>

                    <span className="editor-code-text">Room Code:</span>
                    <span className="editor-code">1234</span>
                    <img className="editor-copy-code" src={require("../icons/copy-icon.png")} alt="copy icon"/>
                </div>
            </div>
        </div>
        
        </>
    );
}

export default Editor;