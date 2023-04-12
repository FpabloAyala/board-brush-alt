import { Component } from "react";
import { resolvePath } from "react-router-dom";
class Space extends Component {
    constructor(props){
        super(props);
        this.state = {
            color: this.props.color,
            i: this.props.space_i,
            j: this.props.space_j,
            token: this.props.token,
            spaceImg: this.props.backImg,
            render:true
        };
    }

    handleClick = () => {
        this.props.spaceClick(this.state.i, this.state.j, this.state.token);
    }

    handleDrop = event => {
        event.stopPropagation();
        event.preventDefault();
        this.props.spaceDrop(this.state.i, this.state.j, this.state.token, this.state.color, this.state.spaceImg);
      };

    handleDragEnter = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    handleDragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
      };

    dragStartHandler = (e) => {
        this.props.tokenDrag(e);
    }

    dragEndHandler = (e) => {
        this.props.tokenDragEnd(this.state.i, this.state.j, this.state.color, this.state.spaceImg);
        this.setState({render: false});  
    }
    

    doToken = () =>{
        if(this.state.token !== null && this.state.render){
            if(this.state.token.search("/icon") == -1){
                return <button className="editor-token-inplay" draggable='true' onDragStart={this.dragStartHandler}
            onDragEnd={this.dragEndHandler} value={this.state.token}><img className="editor-token-img" src={this.state.token} alt="custom icon"/></button>;
            }
            else{
                return <button className="editor-token-inplay" draggable='true' onDragStart={this.dragStartHandler}
            onDragEnd={this.dragEndHandler} value={this.state.token}><img className="token-icon" src={process.env.PUBLIC_URL + this.state.token} alt="pawn icon"/></button>;
            }
        }
    }

    doDiv = () => {
        const spaceID = "editor-space-" + this.state.i + this.state.j;
        if(this.state.color != null){
            return (
            <>
                <div className="editor-board-space" id={spaceID} onClick={this.handleClick}
                style={{backgroundColor: this.state.color}} onDrop={this.handleDrop} draggable="true"
                onDragEnter={(e) => this.handleDragEnter(e)} onDragOver={(e) => this.handleDragOver(e)}>
                    {this.doToken()}
                </div>
            </>
            )
        }
        else if(this.state.spaceImg){
            console.log(this.state.spaceImg);
            return (
                <>
                    <div className="editor-board-space" id={spaceID} onClick={this.handleClick}
                     onDrop={this.handleDrop} onDragEnter={(e) => this.handleDragEnter(e)} 
                     onDragOver={(e) => this.handleDragOver(e)}>
                        <img className="editor-board-img" src={this.state.spaceImg}></img>
                        {this.doToken()}
                    </div>
                </>
                )
        }
        
    }

    render(){
        
        return (
        <>
            {this.doDiv()}
        </>
    );
    }
    
}

export default Space;