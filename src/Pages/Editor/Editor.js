import './Editor.css'
import { useNavigate } from "react-router-dom";
import react, { Component, useEffect } from "react";
import './Space'
import Space from './Space';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { SketchPicker } from 'react-color';




function WithNav(props){
    let navigate = useNavigate();
    return <Editor {...props} navigate={navigate}/>
}

const Observer = ({ fillBoard, gridCols, gridRows}) => {
  console.log("Observer being fired");
  console.log(gridRows);
  console.log(gridCols);
  useEffect(() => {
    fillBoard()
    console.log("Fill board being fired");
  }, [gridCols, gridRows])
  return null // component does not render anything
}



class Editor extends Component {
    constructor(props){
        super(props);
        
        //If windows has nothing stored set state to default
        this.state = {
            buttonList:["Tiles", "Tokens"],
            colorList: ["#f11a31", "#469E1B", "#141F79", "#FBF033"],
            defaultTokenList: ["/icons/pawn-icon.png", '/icons/bishop-icon.png', '/icons/knight-icon.png', '/icons/rook-icon.png', '/icons/queen-icon.png', '/icons/king-icon.png'],
            activeTab: "Tiles",
            gridRows: 5,
            gridCols:9,
            boardSpaces: null,
            currColor: "#f11a31",
            newColor: "#ffffff",
            spaceKey:0,
            isHidden: false,
            draggedToken: null,
            undoQueue: [],
            redoQueue:[],
            settingGrid: false
        };
        //console.log("STATE", this.state);

        if (window.sessionStorage.getItem('state') !== undefined && window.sessionStorage.getItem('state') !== null){
            //console.log("STATE in UNDEFINED",window.sessionStorage.getItem('state'));
            this.state = JSON.parse(window.sessionStorage.getItem('state'));
            console.log("JSON PARSED STATE: ", JSON.parse(window.sessionStorage.getItem('state')));
        }
    }

    setState(state) {
        // let newState = this.state;
        // console.log("NEW STATE: ", newState);
        // newState["boardSpaces"] = null;
        // window.sessionStorage.setItem('state', JSON.stringify(newState));
        super.setState(state);  
    }

    //TODO: Add a color picker where on accept -> set curr color and close and on cancel 
  handleOnColorChange = (color) => {
    this.setState({ newColor: color.hex });
    console.log(color);
  };

  //Add color to list of colors if not already in, once you reach a certain threashold, pop off last used color
  handleOnAddColorClick = (color) =>{
    const maxColors = 7;
    let newColorList = this.state.colorList;
    //console.log("OLD COLOR", this.state.colorList);
    //console.log("ADDED COLOR: ", color);
    //console.log("OLD LIST LEN", newColorList.length);
    if (!newColorList.includes(color)){
        newColorList.push(color);
        if (newColorList.length > maxColors){
            newColorList.shift(); //Removes the first element of list
        }
        this.setState({colorList: newColorList});
        //console.log("NEW COLOR", newColorList);
    }
  }

    //TODO: Popup for Color Picker
PopupGfg() {
    // console.log("Popping Up Right Now!");
    return (
        <div>
            <Popup trigger=
                {<button className="editor-tile-upload">+</button>}
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                Welcome to GFG!!!
                            </div>
                            <div>
                                <SketchPicker
                                    color={this.state.newColor}
                                    onChange={this.handleOnColorChange}>
                                </SketchPicker>
                                <button onClick=
                                    {() => this.handleOnAddColorClick(this.state.newColor)}>
                                        Add Color
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
    )
};

    //TODO: OnClick to open up popup for adding new color
    handleAddColorClick = () => {
        this.PopupGfg()
    }

    addUndo = (board) =>{
        if(this.state.undoQueue.length >= 10){
            const list = [...this.state.undoQueue];
            list.shift();
            list.push(board);
            this.setState({undoQueue: list});
        }
        else{
            const list = [...this.state.undoQueue];
            list.push(board);
            this.setState({undoQueue: list});
        }
        
    }

    addRedo = (board) =>{
        if(this.state.redoQueue.length >= 5){
            const list = [...this.state.redoQueue];
            list.shift();
            list.push(board);
            this.setState({redoQueue: list});
        }
        else{
            const list = [...this.state.redoQueue];
            list.push(board);
            this.setState({redoQueue: list});
        }
        //console.log(this.state.redoQueue.length)
    }

    onRedo = () =>{
        if(this.state.redoQueue.length > 0){
            //const ind = this.state.redoQueue.length - 1;
            this.addUndo([...this.state.boardSpaces]);
            const newRedo = [...this.state.redoQueue];
            const newState = newRedo.pop();
            
            this.setState({boardSpaces: newState, redoQueue: newRedo});
        }
        else{
            //console.log("redo empty");
        }
    }

    onUndo = () =>{
        if(this.state.undoQueue.length > 0){
            //const ind = this.state.undoQueue.length - 1;
            this.addRedo([...this.state.boardSpaces]);
            const newUndo = [...this.state.undoQueue];
            const newState = newUndo.pop();
            
            let key = this.state.spaceKey;

            //nuclear option
            for(let i = 0; i < this.state.gridRows; i++){
                for(let j = 0; j < this.state.gridCols; j++){
                    const ind = (i*9) + j;
                    if(newState[ind].props.token !== null){
                        newState[ind] = <Space key={key} color={newState[ind].props.color} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)}
                        spaceDrop={this.handleTokenDrop.bind(this)} token={newState[ind].props.token} tokenDrag={this.dragStartHandler.bind(this)} 
                        tokenDragEnd={this.dragEndHandler.bind(this)}/>;
                        key++;
                    }
                }
            }
            // newUndo.shift();
            this.setState({boardSpaces: newState, undoQueue: newUndo, spaceKey: key});
        }
        else{
            //console.log("undo empty");
        }
    }

    onLoadButton = () => {
        this.props.navigate('/board-brush/load')
    }

    makeTab = (item) =>{
        if(!this.state.isHidden){
            const normal = "editor-tab";
            const active = "editor-tab-active";
            if(this.state.activeTab === item){
                return <button className={active} id={item}>{item}</button>
            }
            else{
                return <button className={normal} id={item} onClick={this.onTabClick}>{item}</button>
            }  
        }
            
    }

    onTabClick = event => {
        this.setState({activeTab: event.target.id})
    }

    onColorClick = e => {
        this.setState({currColor: e.target.value})
        //console.log(e.target.value);
    }

    fillColor = (item) => {
        return <button className="color-tab" value={item} style={{backgroundColor: item}} onClick={this.onColorClick}></button>
        
    }

    fillDefaultToken = (item) =>{
        return <button className="editor-token" draggable='true' onDragStart={this.dragStartHandler}
        onDragEnd={this.dragEndHandler} value={item}><img className="pawn-icon" src={process.env.PUBLIC_URL + item} alt="undo icon"/></button>
    }

    fillTabs = () => {
        if(this.state.activeTab === "Tiles"){
            return(
                <>
                {/* <button className="editor-tile-red"></button>
                <button className="editor-tile-green"></button>
                <button className="editor-tile-blue"></button>
                <button className="editor-tile-yellow"></button>
                <button className="editor-tile-upload">+</button> */}
                {this.state.colorList.map(item => (
                            this.fillColor(item)
                        ))
                }
                {this.PopupGfg()}
                {/* <button className="editor-tile-upload" onClick={this.handleAddColorClick}>+</button>  */}
                <button className="editor-tab-undo"><img className="editor-tool-icon" src={require("../../icons/undo-icon.png")} alt="undo icon" onClick={this.onUndo}/></button>
                <button className="editor-tab-redo"><img className="editor-tool-icon" src={require("../../icons/redo-icon.png")} alt="redo icon" onClick={this.onRedo}/></button>
                </>
            )
        }
        else{
            return(
                <>
                {this.state.defaultTokenList.map(item => (
                    this.fillDefaultToken(item)
                ))}
                <button className="editor-token-upload">+</button>
                <button className="editor-tab-undo"><img className="editor-tool-icon" src={require("../../icons/undo-icon.png")} alt="undo icon" onClick={this.onUndo}/></button>
                <button className="editor-tab-redo"><img className="editor-tool-icon" src={require("../../icons/redo-icon.png")} alt="redo icon" onClick={this.onRedo}/></button>
                </>
            )
        }
    }

    fillBoard = () => {
        console.log("FILL BOARD:", this.state.gridRows, this.state.gridCols)
        if(this.state.boardSpaces === null || this.state.settingGrid){
            var spaces = [];
            let key = this.state.spaceKey;
            //const token = null
            for(let i = 0; i < this.state.gridRows; i++){
                for(let j = 0; j < this.state.gridCols; j++){
                    spaces.push(<Space key={key} color={"#ffffff"} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)}
                     spaceDrop={this.handleTokenDrop.bind(this)} token={null} tokenDrag={this.dragStartHandler.bind(this)} tokenDragEnd={this.dragEndHandler.bind(this)}/>);
                    key++;
                }
            };
            this.setState({spaceKey: key});
            console.log(this.state.boardSpaces);
            this.setState({boardSpaces: spaces});
            this.setState({settingGrid: false});
        }
    }

    mountHandler = ({ onMount, onUnMount }) => {
        useEffect(() => {
            this.fillBoard();
            onMount()
            return onUnMount
        },[this.state.gridCols, this.state.gridCols])
        return null
        }

    onSpaceClick(i, j, token){
        const ind = (i*9) + j;
        this.addUndo(this.state.boardSpaces);
        this.setState((oldState) => {
            let key = this.state.spaceKey;
            const newSpaces = [...oldState.boardSpaces];
            newSpaces[ind] = <Space key={key}  color={this.state.currColor} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)} spaceDrop={this.handleTokenDrop.bind(this)}
            token = {token} tokenDrag={this.dragStartHandler.bind(this)} tokenDragEnd={this.boardDragEndHandler.bind(this)}/>;
            key++;
            return{ boardSpaces: newSpaces,
            spaceKey: key};
        })
    
    }

    onHide = () =>{
        const toggle = !this.state.isHidden;
        this.setState({isHidden: toggle});
    }

    makeHide(){
        if(!this.state.isHidden){
            return <button className='editor-hide-tabs' onClick={this.onHide}><img className="editor-hide-icon" src={require("../../icons/hide-icon.png")} alt="hide icon"/></button>
        }
        else{
            return <button className='editor-hide-tabs' onClick={this.onHide}><img className="editor-hide-icon" src={require("../../icons/show-icon.png")} alt="show icon"/></button>
        }
    }

    handleTokenDrop(i, j, token, color){
        console.log("" + i +", " +j)
        const ind = (i*9) + j;
        this.addUndo(this.state.boardSpaces);
        this.setState((oldState) => {
        let key = this.state.spaceKey;
        const newSpaces = [...oldState.boardSpaces];
        newSpaces[ind] = <Space key={key}  color={color} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)} spaceDrop={this.handleTokenDrop.bind(this)}
        token = {this.state.draggedToken} tokenDrag={this.dragStartHandler.bind(this)} tokenDragEnd={this.boardDragEndHandler.bind(this)}/>;
        key++;
        return{ boardSpaces: newSpaces,
        spaceKey: key};
        })
        
    }

    dragStartHandler = (e) =>{
        const button = e.currentTarget.value;
        this.setState({draggedToken: button});
    }

    dragEndHandler = (e) =>{
        this.setState({draggedToken: null});
    }

    boardDragEndHandler(i, j, color){
        const ind = (i*9) + j;
        this.setState((oldState) => {
        let key = this.state.spaceKey;
        const newSpaces = [...oldState.boardSpaces];
        newSpaces[ind] = <Space key={key}  color={color} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)} spaceDrop={this.handleTokenDrop.bind(this)}
        token = {null} tokenDrag={this.dragStartHandler.bind(this)} tokenDragEnd={this.boardDragEndHandler.bind(this)}/>;
        key++;
        return{ boardSpaces: newSpaces,
        spaceKey: key, draggedToken: null};
        })
    }

    gridRowHandler = (e) => {
        this.setState({gridRows: e.target.value});
        this.setState({settingGrid: true});
        console.log("grid rows",e.target.value);
    }

    gridColHandler = (e) => {
        this.setState({gridCols: e.target.value});
        this.setState({settingGrid: true});
        console.log("grid cows",e.target.value);
    }

    

    render(){
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
                    
                    <input className='editor-size-input' onChange={this.gridRowHandler} value={this.state.gridRows}></input>
                    <span className="editor-grid-text">X</span>
                    <input className='editor-size-input' onChange={this.gridColHandler} value={this.state.gridCols}></input>
                    

                    <span className="editor-code-text">Room Code:</span>
                    <span className="editor-code">1234</span>
                    <img className="editor-copy-code" src={require("../../icons/copy-icon.png")} alt="copy icon"/>
                </div>
                <div className="editor-board-frame">
                    {this.state.boardSpaces}
                    <Observer gridRows={this.state.gridRows} gridCols={this.state.gridCols} fillBoard={this.fillBoard}> </Observer>
                    <div className="editor-tabs">
                        {this.state.buttonList.map(item => (
                            this.makeTab(item)
                        ))}
                        {this.makeHide()}
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