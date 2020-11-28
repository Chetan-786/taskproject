import React, { Component } from "react";
import NewNotesComponent from "./newNotesComponent";

class HeaderNotes extends Component {
    constructor(props) {
        super(props);

        this.showNote = this.showNote.bind(this);
        this.addImage = this.addImage.bind(this);
        this.addList = this.addList.bind(this);
        this.callBackFnToCloseDiv = this.callBackFnToCloseDiv.bind(this);

        this.state = {
            showNoteData: false,
            showImgData: false,
            showListData: false,
            addNotesDisplay: false,
        }
    }

    addList() {
        this.setState({
            showListData: true,
            addNotesDisplay: true
        })
    }
    addImage() {
        this.setState({
            showImgData: true,
            addNotesDisplay: true
        })
    }
    showNote() {
        this.setState({
            showNoteData: true,
            addNotesDisplay: true,
        })
    }
    /**
     * This Fn is used to close the div
     * @param {Boolean} val if true then call api on display component
     */
    callBackFnToCloseDiv(val = false) {
        this.setState({
            addNotesDisplay: false
        })
        if (!val) {
            this.props.headerNotesProps(true);
        }
    }

    render() {
        // console.log(this.props.headerNotesProps)
        return (
            <div className="headerNotes">
                {!this.state.addNotesDisplay ?
                    <div className="row col-md-12 BorderCommon">
                        <div className="col-md-10">
                            <input type="text" className="col-md-10 noBorderInput" placeholder="Take a Note..."
                                onClick={() => this.showNote()} />
                        </div>
                        <div className="col-md-1">
                            <i className="fa fa-check-square" aria-hidden="true" onClick={() => this.addList()}></i>
                        </div>
                        <div className="col-md-1">
                            <i className="fa fa-image" aria-hidden="true" onClick={() => this.addImage()}></i>
                        </div>
                    </div>
                    :
                    <NewNotesComponent addListProps={this.state.showListData} addImageProps={false}
                        showNoteProps={this.state.showNoteData} closeDivProps={this.callBackFnToCloseDiv} />
                }
            </div>
        )
    }
}

export default HeaderNotes;