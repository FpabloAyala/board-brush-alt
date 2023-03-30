import { useNavigate } from "react-router-dom";
import react, { Component } from "react";
import './Play.css'
import '../Components/RulesPopup'
import RulesPopup from "../Components/RulesPopup";
import HelpPopup from "../Components/HelpPopup";



function WithNav(props){
    let navigate = useNavigate();
    return <Play {...props} navigate={navigate}/>
}

class Play extends Component {
    constructor(props){
        super(props);
        this.state = {
            buttonList:["Players", "Rules", "Help"],
            activeTab: "Players",
            gridRows: 5,
            gridCols:9,
            isRules:false,
            isHelp:false
        };
    }

    onLoadButton = () => {
        this.props.navigate('/board-brush/load')
    }

    makeTab = (item) =>{
        const normal = "play-tab-" + item.toString().toLowerCase();
        const active = "play-tab-" + item.toString().toLowerCase() + "-active";
        if(this.state.activeTab === item){
            return <button className={active} id={item}>{item}</button>
        }
        else{
            return <button className={normal} id={item} onClick={this.onTabClick}>{item}</button>
        }
    }

    fillTabs = () => {
        if(this.state.activeTab === "Players"){
            return(
            <>
            <button className="play-token-1">1</button>
            </>
            )
        }
        
    }

    onTabClick = event => {
        if(event.target.id === "Rules"){
            this.toggleRules();
        }
        if(event.target.id === "Help"){
            this.toggleHelp();
        }
        
    }

    fillBoard = () => {
        var spaces = [];
        for(let i = 0; i < this.state.gridRows; i++){
            for(let j = 0; j < this.state.gridCols; j++){
                spaces.push(<div className="play-board-space"></div>)
            }
        }
        return spaces;
    }

    toggleRules = () =>{
        this.setState({isRules: !this.state.isRules});
    }

    toggleHelp = () =>{
        this.setState({isHelp: !this.state.isHelp});
    }

    doPopups = () => {
        if(this.state.isRules){
            return <RulesPopup handleClose={this.toggleRules}></RulesPopup>;
        }
        if(this.state.isHelp){
            return <HelpPopup handleClose={this.toggleHelp}></HelpPopup>;
        }
    }

    onExitButton = () => {
        this.props.navigate('/board-brush')
    }

    render(){
        
        
        return (
        <>
        <div className="play-container">
            {this.doPopups()}
            <div className="play-right-side">
                <div className="play-header-bar">
                    <span className="play-title">User's Game</span>

                    <span className="play-code-text">Room Code:</span>
                    <span className="play-code">1234</span>
                    <img className="play-copy-code" src={require("../icons/copy-icon.png")} alt="copy icon"/>
                    <button className="load-exit-button" onClick={this.onExitButton}>
                        <span className="load-exit-text">Exit</span>
                        <img className="load-exit-icon" src={require("../icons/exit-icon.png")} alt="exit icon"></img>
                    </button>
                </div>
                <div className="play-board-frame">
                    {this.fillBoard()}
                    <div className="play-tabs">
                        {this.state.buttonList.map(item => (
                            this.makeTab(item)
                        ))}
                    </div>
                </div>
                <div className="play-tab-content">
                            {this.fillTabs()}
                </div>
            </div>
        </div>
        
        </>
    );
    }
    
}

export default WithNav;