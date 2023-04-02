import './Editor.css'
import { useNavigate } from "react-router-dom";
import react, { Component } from "react";
import './Space'
import Space from './Space';


function WithNav(props){
    let navigate = useNavigate();
    return <Editor {...props} navigate={navigate}/>
}

class Editor extends Component {
    constructor(props){
        super(props);
        this.state = {
            buttonList:["Tiles", "Tokens"],
            activeTab: "Tiles",
            gridRows: 5,
            gridCols:9,
            boardSpaces: null,
            currColor: "#f11a31"
        };
    }

    onLoadButton = () => {
        this.props.navigate('/board-brush/load')
    }

    makeTab = (item) =>{
        const normal = "editor-tab-" + item.toString().toLowerCase();
        const active = "editor-tab-" + item.toString().toLowerCase() + "-active";
        if(this.state.activeTab === item){
            return <button className={active} id={item}>{item}</button>
        }
        else{
            return <button className={normal} id={item} onClick={this.onTabClick}>{item}</button>
        }
    }

    onTabClick = event => {
        this.setState({activeTab: event.target.id})
    }

    fillTabs = () => {
        if(this.state.activeTab === "Tiles"){
            return(
                <>
                <button className="editor-tile-red"></button>
                <button className="editor-tile-green"></button>
                <button className="editor-tile-blue"></button>
                <button className="editor-tile-yellow"></button>
                <button className="editor-tile-upload">+</button>
                <button className="editor-tab-undo"><img className="editor-tool-icon" src={require("../../icons/undo-icon.png")} alt="undo icon"/></button>
                <button className="editor-tab-redo"><img className="editor-tool-icon" src={require("../../icons/redo-icon.png")} alt="redo icon"/></button>
                </>
            )
        }
        else{
            return(
                <>
                <button className="editor-token-1">1</button>
                <button className="editor-token-2">2</button>
                <button className="editor-token-3">3</button>
                <button className="editor-token-upload">+</button>
                <button className="editor-tab-undo"><img className="editor-tool-icon" src={require("../../icons/undo-icon.png")} alt="undo icon"/></button>
                <button className="editor-tab-redo"><img className="editor-tool-icon" src={require("../../icons/redo-icon.png")} alt="redo icon"/></button>
                </>
            )
        }
    }

    fillBoard = () => {
        if(this.state.boardSpaces === null){
            var spaces = [];
            for(let i = 0; i < this.state.gridRows; i++){
                for(let j = 0; j < this.state.gridCols; j++){
                    spaces.push(<Space color={"#ffffff"} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this, i, j)}/>);
                }
            }
            this.setState({boardSpaces: spaces});
        }
        
    }

    onSpaceClick(i, j){
        console.log("" + i + ", " + j);
        const list = [];
        const currColor = this.state.currColor;
        list[(i*this.state.gridRows) + j] = <Space color={currColor} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this, i, j)}/>;
        this.setState({boardSpaces: list});
        console.log(this.state.boardSpaces);
    }

    setBoard(){
        return this.state.boardSpaces;
    }

    render(){
        this.fillBoard()
        
        return (
        <>
        <div className="editor-container">
            <div className="editor-tool-bar">
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/save-icon.png")} alt="save icon"/></button>
                <button className="editor-icon-button" onClick={this.onLoadButton}><img className="editor-tool-icon" src={require("../../icons/load-icon.png")} alt="load icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/hand-icon.png")} alt="grab icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/paint icon.png")} alt="paint brush icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/fill-bucket-icon.png")} alt="bucket icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/eraser-icon.png")} alt="eraser icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/type-icon.png")} alt="T icon"/></button>
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/ruler-icon.png")} alt="ruler icon"/></button>
            </div>
            <div className="editor-right-side">
                <div className="editor-header-bar">
                    <span className="editor-title">Board Editor</span>
                    <div className="editor-play-button">
                        <span className="editor-start-text">Start Game</span>
                        <img className="editor-play-icon" src={require("../../icons/play-icon-green.png")} alt="play button"/>
                    </div>

                    <span className="editor-grid-text">Grid Size:</span>
                    <input className='editor-size-input'></input>
                    <span className="editor-grid-text">X</span>
                    <input className='editor-size-input'></input>

                    <span className="editor-code-text">Room Code:</span>
                    <span className="editor-code">1234</span>
                    <img className="editor-copy-code" src={require("../../icons/copy-icon.png")} alt="copy icon"/>
                </div>
                <div className="editor-board-frame">
                    {this.setBoard()}
                    <div className="editor-tabs">
                        {this.state.buttonList.map(item => (
                            this.makeTab(item)
                        ))}
                    </div>
                </div>
                <div className="editor-tab-content">
                            {this.fillTabs()}
                </div>
            </div>
        </div>
        
        </>
    );
    }
    
}

export default WithNav;