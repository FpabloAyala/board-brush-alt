import react, { Component } from "react";

export default function Space(props) {
    const {color, x, y} = props;
        return(
            <>
            <div className="editor-board-space" style={{backgroundColor:  color}}>{color +x + y}</div>
            </>
        );
}
