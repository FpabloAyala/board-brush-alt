import React, { useRef } from 'react'

const UploadButton = ({name, callBack}) => {
    const upRef = useRef();

    const buttonClick = () =>{
        upRef.current.click();
    }

    const imageChange = (e) =>{
        if(e.target.files && e.target.files[0]){
            const img = e.target.files[0];
            callBack(img);
        }
    }

    return(
        <>
            <button className={name}><img className="editor-upload-icon" src={require("../../icons/add-image-icon.png")} alt="unpload image icon" onClick={buttonClick} /></button>
            <input ref={upRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }} onChange={imageChange}/>
        </>
    )
}

export default UploadButton;