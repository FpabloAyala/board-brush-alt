import react, { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./Load.css"

function LoadWithNav(props){
    let navigate = useNavigate();
    return <Load {...props} navigate={navigate}/>
}

class Load extends Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
    }

    onExitButton = () => {
        this.props.navigate('/')
    }

    render(){
        
        return (
        <>
        <div className="wrapper">
        <div className="load-header">
            <img className="load-load-icon" src={require("../icons/load-icon.png")} alt="load icon"></img>
            <span className="load-header-text">Load Boards</span>
            <span className="load-header-name">UserName</span>
        </div>
            <div className="load-recent">
                <div className="load-recent-header">
                    <span className="load-recent-text">Recent Boards</span>
                    <button className="load-recent-button">
                        <span className="load-new-text">New Board</span> 
                        <img className="load-plus-icon" src={require("../icons/plus-icon.png")} alt="new board icon"></img>
                    </button>
                </div>
            </div>
            <div className="load-folders">
                <div className="load-folder-header">
                    <span className="load-recent-text">Folders</span>
                    <button className="load-recent-button">
                        <span className="load-new-text">Add Folder</span> 
                        <img className="load-plus-icon" src={require("../icons/add-folder-icon.png")} alt="add folder icon"></img>
                    </button>
                </div>
            </div>
            <div className="load-footer">
                <button className="load-exit-button" onClick={this.onExitButton}>
                    <span className="load-exit-text">Exit</span>
                    <img className="load-exit-icon" src={require("../icons/exit-icon.png")} alt="exit icon"></img>
                </button>
            </div>
        </div>
            
        </>
    );
    }
}

export default LoadWithNav;