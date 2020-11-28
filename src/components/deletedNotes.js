import React, { Component } from "react";
import DisplayBodyNotes from "./bodyNotesDisplay";
import constants from "../constants";


class DeletedNotes extends Component {


    render() {


        return (
            <div className="notesCss">
                <DisplayBodyNotes page={constants.GetDeletedNotes} />
            </div>
        )
    }


}

export default DeletedNotes;