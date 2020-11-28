import React, { Component } from "react";
import DisplayBodyNotes from "./bodyNotesDisplay";
import constants from "../constants";


class ArchivedNotes extends Component {


    render() {


        return (
            <div className="notesCss">
                <DisplayBodyNotes page={constants.GetArchivedNotes} />
            </div>
        )
    }


}

export default ArchivedNotes;