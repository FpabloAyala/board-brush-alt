import './Editor.css'
import { useNavigate } from "react-router-dom";
import react, { Component, useEffect, useRef } from "react";
import './Space'
import Space from './Space';
import UploadButton from './UploadButton';
import Popup from 'reactjs-popup';
import HelpPopup from './HelpPopup';
import 'reactjs-popup/dist/index.css';
import { SketchPicker } from 'react-color';
import RulesPopup from './RulesPopup';




function WithNav(props){
    let navigate = useNavigate();
    return <Editor {...props} navigate={navigate}/>
}

const Observer = ({ fillBoard, gridCols, gridRows}) => {
  useEffect(() => {
    fillBoard()
  }, [gridCols, gridRows])
  return null // component does not render anything
}



class Editor extends Component {
    constructor(props){
        super(props);
        //If windows has nothing stored set state to default
        this.state = {
            buttonList:["Tiles", "Tokens", "Rules"],
            colorList: ["#f11a31", "#469E1B", "#141F79", "#FBF033"],
            customTiles:[],
            defaultTokenList: ["/icons/pawn-icon.png", '/icons/bishop-icon.png', '/icons/knight-icon.png', '/icons/rook-icon.png', '/icons/queen-icon.png', '/icons/king-icon.png'],
            customTokens:[],
            activeTab: "Tiles",
            gridRows: 8,
            gridCols:8,
            boardSpaces: null,
            currColor: "#f11a31",
            newColor: "#ffffff",
            currImg: null,
            paintImg: false,
            //currToken: null, //For token
            //paintToken: false, //For token
            spaceKey: 0,
            isHidden: false,
            activeTool: 1,
            bucketStart: [],
            draggedToken: null,
            undoQueue: [],
            redoQueue:[],
            showHelp: false,
            showRules: false,
            rulesList: [],
            settingGrid: false
        };

        if (window.sessionStorage.getItem('state') !== undefined && window.sessionStorage.getItem('state') !== null){
            this.state = JSON.parse(window.sessionStorage.getItem('state'));
            //console.log("JSON PARSED STATE: ", JSON.parse(window.sessionStorage.getItem('state')));
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
    //console.log(color);
  };

  //Add color to list of colors if not already in, once you reach a certain threashold, pop off last used color
  handleOnAddColorClick = (color) =>{
    const maxColors = 7;
    let newColorList = this.state.colorList;
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
    return (
        <div>
            <Popup trigger=
                {<button className="editor-tile-upload">+</button>}
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            
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
                    const ind = (i*this.state.gridCols) + j;
                    if(newState[ind].props.token !== null){
                        newState[ind] = <Space key={key} color={newState[ind].props.color} backImg={newState[ind].props.backImg} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)}
                        spaceDrop={this.handleTokenDrop.bind(this)} token={newState[ind].props.token} tokenDrag={this.dragStartHandler.bind(this)} 
                        tokenDragEnd={this.dragEndHandler.bind(this)}/>;
                        key++;
                    }
                }
            }
            // newUndo.shift();
            this.setState({boardSpaces: newState, undoQueue: newUndo, spaceKey: key});
        }
    }

    onLoadButton = () => {
        this.props.navigate('/board-brush/load')
    }

    onStartGame = () => {
        this.props.navigate('/board-brush/play')
    }

    onToolClick = (e) => {
        const clickedTool = e.currentTarget.value;
        this.setState({activeTool: clickedTool});
        console.log(clickedTool)
        if(clickedTool == 3){
            this.setState({currColor: "#ffffff", paintImg: false , /*for token paintToken: false*/});
        }
    }

    makeTabParent = () =>{
        if(!this.state.isHidden){
            return (<>
                <div className="editor-tabs">
                            {this.state.buttonList.map(item => (
                                this.makeTab(item)
                            ))}
                        </div>
            </>)
        }
        
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
        this.setState({currColor: e.target.value, paintImg: false, activeTool: 1, /*for token paintToken: false*/});
    }
    onCustomClick = e => {
        this.setState({currImg: e.currentTarget.value, paintImg: true, activeTool: 1, /*for token paintToken: false*/});
    }

    fillColor = (item) => {
        let style = {backgroundColor: item};
        if(this.state.currColor === item && !this.state.paintImg /*for token  && !this.state.paintToken*/){
            style = {
                borderColor: "red",
                backgroundColor: item};
        }
        return <button className="color-tab" value={item} style={style} onClick={this.onColorClick}></button>
        
    }

    fillImgTiles = (item) =>{
        let style = {};
        if(this.state.currImg === item && this.state.paintImg /*for token  && !this.state.paintToken*/){
            style = {borderColor: "red"};
        }
        return <button className="color-tab" style={style} value={item} onClick={this.onCustomClick}><img className="editor-tile-img" value={item} src={item} alt="custom image"/></button>;
    }

    tileImage = (img) =>{
        const imgURL = URL.createObjectURL(img);
        this.setState((oldState) =>{
            const list =[...oldState.customTiles]
            if(list.length == 4){
                list.shift();
                list.push(imgURL);
            }
            else{
                list.push(imgURL);
            }
            return {customTiles: list}
        })
    }

    tokenImage = (img) =>{
        const imgURL = URL.createObjectURL(img);
        this.setState((oldState) =>{
            const list =[...oldState.customTokens]
            if(list.length == 4){
                list.shift();
                list.push(imgURL);
            }
            else{
                list.push(imgURL);
            }
            return {customTokens: list}
        })
    }

    /*For token 
    onTokenClick = (e) =>{
        console.log(e.currentTarget.value);
        this.setState({currToken: e.currentTarget.value, paintImg: false, activeTool: 1, paintToken: true});
    }*/

    fillDefaultToken = (item) =>{
        return <button className="editor-token" draggable='true' onDragStart={this.dragStartHandler} /*for Token  onClick={this.onTokenClick}*/
        onDragEnd={this.dragEndHandler} value={item}><img className="pawn-icon" src={process.env.PUBLIC_URL + item} alt="undo icon"/></button>
    }

    fillImgTokens = (item) =>{
        console.log(item);
        return <button className="editor-token" draggable='true' onDragStart={this.dragStartHandler} /*for Token  onClick={this.onTokenClick}*/
        onDragEnd={this.dragEndHandler} value={item}><img className="editor-token-img" src={item} alt="custom image"/></button>
    }

    fillTabs = () => {
        if(this.state.activeTab === "Tiles"){
            return(
                <>
                {this.state.colorList.map(item => (
                            this.fillColor(item)
                        ))
                }
                {this.PopupGfg()}

                {this.state.customTiles.map(item =>(
                    this.fillImgTiles(item)
                ))}
                <UploadButton name={"editor-tile-upload"} callBack={this.tileImage}></UploadButton>
                <button className="editor-tab-undo"><img className="editor-tool-icon" src={require("../../icons/undo-icon.png")} alt="undo icon" onClick={this.onUndo}/></button>
                <button className="editor-tab-redo"><img className="editor-tool-icon" src={require("../../icons/redo-icon.png")} alt="redo icon" onClick={this.onRedo}/></button>
                </>
            )
        }
        else if(this.state.activeTab === "Tokens"){
            return(
                <>
                {this.state.defaultTokenList.map(item => (
                    this.fillDefaultToken(item)
                ))}
                
                {this.state.customTokens.map(item =>(
                    this.fillImgTokens(item)
                ))}
                <UploadButton name={"editor-token-upload"} callBack={this.tokenImage}></UploadButton>
                <button className="editor-tab-undo"><img className="editor-tool-icon" src={require("../../icons/undo-icon.png")} alt="undo icon" onClick={this.onUndo}/></button>
                <button className="editor-tab-redo"><img className="editor-tool-icon" src={require("../../icons/redo-icon.png")} alt="redo icon" onClick={this.onRedo}/></button>
                </>
            )
        }
        else{
            return (
            <>
                <button className="editor-token" onClick={this.toggleRules}>
                    <img className="editor-rules-img" src={require("../../icons/rules-icon.png")} alt="custom image"/>
                </button>
                <button className="editor-tab-undo"><img className="editor-tool-icon" src={require("../../icons/undo-icon.png")} alt="undo icon" onClick={this.onUndo}/></button>
                <button className="editor-tab-redo"><img className="editor-tool-icon" src={require("../../icons/redo-icon.png")} alt="redo icon" onClick={this.onRedo}/></button>
            </>)
        }
    }

    fillBoard = () => {
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
        if(this.state.activeTool == 1 || this.state.activeTool == 3){
            const ind = (i*this.state.gridCols) + j;
            this.addUndo(this.state.boardSpaces);
            if(!this.state.paintImg /*for token  && !this.state.paintToken*/){
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
            else if(this.state.paintImg){
                this.setState((oldState) => {
                    let key = this.state.spaceKey;
                    const newSpaces = [...oldState.boardSpaces];
                    newSpaces[ind] = <Space key={key}  backImg={this.state.currImg} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)} spaceDrop={this.handleTokenDrop.bind(this)}
                    token = {token} tokenDrag={this.dragStartHandler.bind(this)} tokenDragEnd={this.boardDragEndHandler.bind(this)}/>;
                    key++;
                    return{ boardSpaces: newSpaces,
                    spaceKey: key};
                })
            }
            /*for token 
            else{
                this.setState((oldState) => {
                    let key = this.state.spaceKey;
                    const newSpaces = [...oldState.boardSpaces];
                    newSpaces[ind] = <Space key={key} color={newSpaces[ind].props.color}  backImg={newSpaces[ind].props.backImg} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)} spaceDrop={this.handleTokenDrop.bind(this)}
                    token = {this.state.currToken} tokenDrag={this.dragStartHandler.bind(this)} tokenDragEnd={this.boardDragEndHandler.bind(this)}/>;
                    key++;
                    return{ boardSpaces: newSpaces,
                    spaceKey: key};
                })
            }*/
        }
        else if(this.state.activeTool == 2){
            
            if(this.state.bucketStart.length > 0){
                this.addUndo(this.state.boardSpaces);
                let startI = Math.min(i, this.state.bucketStart[0]);
                let startJ = Math.min(j, this.state.bucketStart[1]);
                let endI = Math.max(i, this.state.bucketStart[0]);
                let endJ = Math.max(j, this.state.bucketStart[1]);
                console.log(startI);
                const newState = [...this.state.boardSpaces];
                let key = this.state.spaceKey;
                if(!this.state.paintImg){
                    for(let is = startI; is <= endI; is++){
                        for(let js = startJ; js <= endJ; js++){
                            const ind = (is*this.state.gridCols) + js;
                                newState[ind] = <Space key={key} color={this.state.currColor} space_i={is} space_j={js} spaceClick={this.onSpaceClick.bind(this)}
                                spaceDrop={this.handleTokenDrop.bind(this)} token={newState[ind].props.token} tokenDrag={this.dragStartHandler.bind(this)} 
                                tokenDragEnd={this.dragEndHandler.bind(this)}/>;
                                key++;
                        }
                    }
                    this.setState({boardSpaces: newState, spaceKey: key, bucketStart: []});
                }
                else{
                    for(let is = startI; is <= endI; is++){
                        for(let js = startJ; js <= endJ; js++){
                            const ind = (is*this.state.gridCols) + js;
                                newState[ind] = <Space key={key} backImg={this.state.currImg} space_i={is} space_j={js} spaceClick={this.onSpaceClick.bind(this)}
                                spaceDrop={this.handleTokenDrop.bind(this)} token={newState[ind].props.token} tokenDrag={this.dragStartHandler.bind(this)} 
                                tokenDragEnd={this.dragEndHandler.bind(this)}/>;
                                key++;
                        }
                    }
                    this.setState({boardSpaces: newState, spaceKey: key, bucketStart: []});
                }
            }
            else{
                this.setState({bucketStart: [i, j]});
            }
        }
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

    handleTokenDrop(i, j, token, color, img){
        const ind = (i*this.state.gridCols) + j;
        this.addUndo(this.state.boardSpaces);
        this.setState((oldState) => {
        let key = this.state.spaceKey;
        const newSpaces = [...oldState.boardSpaces];
        newSpaces[ind] = <Space key={key}  color={color} backImg={img} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)} spaceDrop={this.handleTokenDrop.bind(this)}
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

    boardDragEndHandler(i, j, color, img){
        const ind = (i*this.state.gridCols) + j;
        this.setState((oldState) => {
            let key = this.state.spaceKey;
            const newSpaces = [...oldState.boardSpaces];
            newSpaces[ind] = <Space key={key}  color={color} backImg={img} space_i={i} space_j={j} spaceClick={this.onSpaceClick.bind(this)} spaceDrop={this.handleTokenDrop.bind(this)}
            token = {null} tokenDrag={this.dragStartHandler.bind(this)} tokenDragEnd={this.boardDragEndHandler.bind(this)}/>;
            key++;
            return{ boardSpaces: newSpaces,
            spaceKey: key, draggedToken: null};
            })
    }

    gridRowHandler = (e) => {
        this.setState({gridRows: e.target.value});
        this.setState({settingGrid: true});
        //console.log("grid rows",e.target.value);
    }

    gridColHandler = (e) => {
        this.setState({gridCols: e.target.value});
        this.setState({settingGrid: true});
        //console.log("grid cows",e.target.value);
    }

    doTools = () => {
        let grabStyle = {};
        let brushStyle = {};
        let bucketStyle = {};
        let eraserStyle = {};
        if(this.state.activeTool == 0){
            grabStyle = {borderColor: "red"};
        }
        else if(this.state.activeTool == 1){
            brushStyle = {borderColor: "red"};
        }
        else if(this.state.activeTool == 2){
            bucketStyle = {borderColor: "red"};
        }
        else{
            eraserStyle = {borderColor: "red"};
        }
        
        return(
            <>
                <button className="editor-icon-button" value={0} onClick={this.onToolClick} style={grabStyle}><img className="editor-tool-icon" src={require("../../icons/hand-icon.png")} alt="grab icon"/></button>
                <button className="editor-icon-button" value={1} onClick={this.onToolClick} style={brushStyle}><img className="editor-tool-icon" src={require("../../icons/paint icon.png")} alt="paint brush icon"/></button>
                <button className="editor-icon-button" value={2} onClick={this.onToolClick} style={bucketStyle}><img className="editor-tool-icon" src={require("../../icons/fill-bucket-icon.png")} alt="bucket icon"/></button>
                <button className="editor-icon-button" value={3} onClick={this.onToolClick} style={eraserStyle}><img className="editor-tool-icon" src={require("../../icons/eraser-icon.png")} alt="eraser icon"/></button>
            </>);
    }

    doFrame = () =>{
        let frameStyle = {gridTemplateColumns: "repeat("+this.state.gridCols+", 1fr)"};
        return(
            <>
                <div style={frameStyle} className="editor-board-frame" draggable="false">
                    {this.state.boardSpaces}
                    <Observer gridRows={this.state.gridRows} gridCols={this.state.gridCols} fillBoard={this.fillBoard}> </Observer>
                    {this.makeTabParent()}
                    {this.makeHide()}
                </div>
            </>
        )
    }

    toggleHelp = () =>{
        const toggle = !this.state.showHelp
        this.setState({showHelp: toggle});
    }

    toggleRules = () =>{
        const toggle = !this.state.showRules
        this.setState({showRules: toggle});
    }

    closeRules = (rules) =>{
        this.setState({rulesList: rules});
        this.toggleRules()
    }

    doPopup = () =>{
        if(this.state.showHelp){
            return <HelpPopup handleClose={this.toggleHelp}></HelpPopup>
        }
        else if(this.state.showRules){
            return <RulesPopup handleClose={this.closeRules} rules={this.state.rulesList}></RulesPopup>
        }
    }

    render(){
        return (
        <>
        <div className="editor-container" draggable="false">
            {this.doPopup()}
            <div className="editor-tool-bar">
                <button className="editor-icon-button"><img className="editor-tool-icon" src={require("../../icons/save-icon.png")} alt="save icon"/></button>
                <button className="editor-icon-button" onClick={this.onLoadButton}><img className="editor-tool-icon" src={require("../../icons/load-icon.png")} alt="load icon"/></button>
                {this.doTools()}
                <button className="editor-help-button" onClick={this.toggleHelp}><img className="editor-tool-icon" src={require("../../icons/help-icon.png")} alt="help icon"/></button>
            </div>
            <div className="editor-right-side">
                <div className="editor-header-bar">
                    <span className="editor-title">Board Editor</span>
                    <button className="editor-play-button" onClick={this.onStartGame}>
                        <span className="editor-start-text">Start Game</span>
                        <img className="editor-play-icon" src={require("../../icons/play-icon-green.png")} alt="play button"/>
                    </button>

                    <span className="editor-grid-text">Grid Size:</span>
                    
                    <input className='editor-size-input' onChange={this.gridRowHandler} value={this.state.gridRows}></input>
                    <span className="editor-grid-text">X</span>
                    <input className='editor-size-input' onChange={this.gridColHandler} value={this.state.gridCols}></input>
                    

                    <span className="editor-code-text">Room Code:</span>
                    <span className="editor-code">1234</span>
                    <img className="editor-copy-code" src={require("../../icons/copy-icon.png")} alt="copy icon"/>
                </div>
                {this.doFrame()}
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