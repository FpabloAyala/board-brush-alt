import react, { useState, Component } from "react";
import './Login.css'
import { useNavigate } from "react-router-dom";
import HostPrompt from "../Components/HostPrompt";
import JoinPrompt from "../Components/JoinPrompt";

function LoginWithNav(props){
    let navigate = useNavigate();
    return <Login {...props} navigate={navigate}/>
}

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            isHost:false,
            isJoining:false
        };
    }

    onExitButton = () => {
        this.props.navigate('/editor');
    }

    toggleHost = () => {
        this.setState({isHost: !this.state.isHost});
    }

    toggleJoin = () => {
        this.setState({isJoining: !this.state.isJoining});
    }

    doPopup = () => {
        
        if(this.state.isHost){
            return <HostPrompt handleClose={this.toggleHost}></HostPrompt>;
        }
        console.log("in popup");
        console.log(this.state.isJoining);
        if(this.state.isJoining){
            return <JoinPrompt handleClose={this.toggleJoin}></JoinPrompt>;
        }
    }

    render(){
        
        return (
        <>
            <div className="wrapper">
                {
                  this.doPopup()
                }
                <div className="login-title-section">
                    <span className="login-title-text">Board Brush</span>
                    <span className="login-subtitle-text">
                        Turn your ideas into a table top reality!
                    </span>
                </div>
                <div className="login-button-section">
                    <button className="login-host-button" onClick={this.toggleHost}>Host Game</button>
                </div>
                <div className="login-button-section">
                <button className="login-join-button" onClick={this.toggleJoin}>Join Game</button>
                </div>
            </div>
        </>
    );
    }
}

export default LoginWithNav;