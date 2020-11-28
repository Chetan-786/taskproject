import React from "react";

const NotesTitle = (props) => {
    return (
        <input type="text" placeholder="Title" onChange={props && props.onInputChange} className={props.className} />
    )
}

export default NotesTitle