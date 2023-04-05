import { Component } from "react";
class Space extends Component {
    constructor(props){
        super(props);
        this.state = {
            color: this.props.color,
            i: this.props.space_i,
            j: this.props.space_j,
            token: this.props.token
        };
    }

    handleClick = () => {
        this.props.spaceClick(this.state.i, this.state.j);
    }

    handleDrop = event => {
        event.stopPropagation();
        event.preventDefault();
        this.props.spaceDrop(this.state.i, this.state.j, this.state.token, this.state.color);
      };

    handleDragEnter = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    handleDragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
      };

    doToken = () =>{
        if(this.state.token !== null){
            return <button className="editor-token-inplay" draggable='true' onDragStart={this.dragStartHandler}
            onDragEnd={this.dragEndHandler} value={this.state.token}><img className="token-icon" src={process.env.PUBLIC_URL + this.state.token} alt="pawn icon"/></button>
            //console.log(this.state.token);
        }
    }

    render(){
        const spaceID = "editor-space-" + this.state.i + this.state.j;
        return (
        <>
            <div className="editor-board-space" id={spaceID} onClick={this.handleClick}
            style={{backgroundColor: this.state.color}} onDrop={this.handleDrop} 
            onDragEnter={(e) => this.handleDragEnter(e)} onDragOver={(e) => this.handleDragOver(e)}>
                {this.doToken()}
            </div>
        </>
    );
    }
    
}

export default Space;