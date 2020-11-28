import React from "react";

const NotesBody = props => {
    console.log(props)
    return (
        <div contentEditable="true" suppressContentEditableWarning={true} onKeyPress={props && props.keyPress} onChange={props && props.onInput} id="inputNotesBody">
            <input type="checkbox" />{props.onInputChange}
            {/* {props.onInputChange} */}
            {/* <input type="text" onChange={props && props.onInputChange} onKeyPress={props && props.keyPress} id="inputNotesBody" /> */}
        </div>
    )
}

export default NotesBody;