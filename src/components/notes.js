import React, { Component } from "react";
import HeaderNotes from "./headerNotes";
import DisplayBodyNotes from "./bodyNotesDisplay";

class Notes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            callApiFn: false
        }
        this.sendPropsToDisplayFn = this.sendPropsToDisplayFn.bind(this);
    }

    sendPropsToDisplayFn(data) {
        this.setState({
            callApiFn: data
        })
    }
    render() {
        return (
            <div className="notesCss">
                <HeaderNotes headerNotesProps={this.sendPropsToDisplayFn} />
                <DisplayBodyNotes callApiFnProps={this.state.callApiFn} />
            </div>

        )
    }
}

export default Notes;