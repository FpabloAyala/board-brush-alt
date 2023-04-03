import { Component } from "react";
class Space extends Component {
    constructor(props){
        super(props);
        this.state = {
            color: this.props.color,
            i: this.props.space_i,
            j: this.props.space_j,
        };
    }

    handleClick = () => {
        this.props.spaceClick(this.state.i, this.state.j);
    }

    render(){
        const spaceID = "editor-space-" + this.state.i + this.state.j;
        return (
        <>
            <div className="editor-board-space" id={spaceID} onClick={this.handleClick}
            style={{backgroundColor: this.state.color}}></div>
        </>
    );
    }
    
}

export default Space;