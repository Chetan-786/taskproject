import React, { Component } from "react";
import NotesTitle from "./notesTitle";
// import NotesBody from "./notesBody";
import _ from 'lodash';
import constants from "../constants";
// import CommonService from "../services";
import { deleteNoteCommonFn, saveNotesCommonFunction, archiveCommonFunction } from "./utils";
import toastr from 'toastr';
import { Buttons } from "./button";

class NewNotesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notesBodyData: {
                noteTitle: "",
                taskList: [{ "id": 1, "task": "", "isCompleted": 0 }],
                createTimeStamp: "",
                userId: "",
                isPinned: 0,
                backgroundColor: "",
                backgroundImg: "",
            },
            showCheckBoxes: props.addListProps,
            showImage: props.addImageProps,
            showNote: props.showNoteProps,
            localStorage: JSON.parse(localStorage.getItem(constants.LocalStorageGetAllApi)),
        }
        this.initialStateValues = this.state;
        this.checkBoxChange = this.checkBoxChange.bind(this);
        this.taskChange = this.taskChange.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.dropDownEvents = this.dropDownEvents.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onKeyPressFn = this.onKeyPressFn.bind(this);
        this.submitBtn = this.submitBtn.bind(this);
        this.pinNote = this.pinNote.bind(this);
        this.archiveFunction = this.archiveFunction.bind(this);
    }

    handleInputChange(e) {
        try {
            let arrayValues = _.cloneDeep(this.state.notesBodyData);
            arrayValues.noteTitle = e.target.value;
            this.setState({
                notesBodyData: arrayValues
            })
        } catch (error) {
            console.error(error);
        }

    }

    taskChange(e, taskId) {
        try {
            let arrayValues = _.cloneDeep(this.state.notesBodyData);
            arrayValues.taskList[taskId - 1].task = e.target.value;
            this.setState({
                notesBodyData: arrayValues
            })
        } catch (error) {
            console.error(error)
        }

    }

    deleteTask(taskId, isArray = false) {
        try {
            let arrayValues = _.cloneDeep(this.state.notesBodyData);
            // const item of arrayValuesData ? arrayValuesData : [1])
            for (let i = 0; i < (isArray ? taskId.length : 1); i++) {
                const findTaskIndex = _.findIndex(arrayValues.taskList, (num) => num.id === (isArray ? taskId[i].id : taskId));
                if (findTaskIndex < 0) return;
                arrayValues.taskList.splice(findTaskIndex, 1);
                if (arrayValues.taskList.length === 0) {
                    arrayValues.taskList.push({ "id": 1, "task": "", "isCompleted": 0 })
                }
            }
            this.setState({
                notesBodyData: arrayValues
            })


        } catch (error) {
            console.error(error)
        }

    }

    checkBoxChange(taskId, isCompletedStatus = false) {
        try {
            let arrayValues = _.cloneDeep(this.state.notesBodyData);
            const findTaskId = _.findIndex(arrayValues.taskList, (num) => num.id === taskId);
            if (findTaskId < 0) {
                return
            }
            arrayValues.taskList[findTaskId].isCompleted = isCompletedStatus ? 0 : 1;
            this.setState({
                notesBodyData: arrayValues
            })
        } catch (error) {
            console.error(error);
        }

    }

    toggleDropDownFunction(e) {
        document.getElementById(`myDropdown`).classList.toggle('show');
        e.stopPropagation();
    }

    /**
     * Save Notes Function
     * @param {Boolean} openTab if true don't close the div else close it
     */
    submitBtn(openTab = false) {
        try {
            let resp = saveNotesCommonFunction(this.state.notesBodyData, this.state.localStorage[constants.SaveNotes]);
            if (resp) {
                toastr.success("Success");
                if (openTab) {
                    // don't close the div
                } else {
                    this.resetStates();
                    this.props.closeDivProps();
                    // pass props to reset it
                    // close the div
                }
                console.log(resp);
            }
        } catch (error) {
            console.error(error);
        }

    }

    pinNote() {
        try {
            let arrayValues = _.cloneDeep(this.state.notesBodyData);
            arrayValues.isPinned = arrayValues.isPinned ? 0 : 1;
            this.setState({
                notesBodyData: arrayValues
            })
        } catch (error) {
            console.error(error)
        }
    }

    deleteNote() {
        try {
            // give all data to BE to insert it in Delete notes Tablelet resp = deleteNoteCommonFn(this.state.notesBodyData, this.state.localStorage[constants.DeleteNotes])
            let resp = deleteNoteCommonFn(this.state.notesBodyData, this.state.localStorage[constants.DeleteNotes])
            if (resp) {
                // dlt note
                this.props.closeDivProps();
                // close the tab
                console.log(resp);
            }
        } catch (error) {
            console.error(error);
        }

    }

    uncheckAllItems() {
        try {
            let arrayValues = _.cloneDeep(this.state.notesBodyData);
            for (const item of arrayValues.taskList) {
                if (item.isCompleted === 1) {
                    item.isCompleted = 0;
                }
            }
            this.setState({
                notesBodyData: arrayValues
            })
        } catch (error) {
            console.error(error);
        }

    }

    deleteCheckedItems() {
        try {
            const findCheckedItems = _.filter(this.state.notesBodyData.taskList, (num) => num.isCompleted === 1);
            this.deleteTask(findCheckedItems, true);
        } catch (error) {
            console.error(error);
        }
    }

    dropDownEvents(val) {
        switch (val) {
            // Delete Note
            case "delete":
                this.deleteNote();
                break;

            // Make a Copy
            case "copy":
                this.submitBtn(true);
                break;

            // CheckBox Display Flag
            case "checkbox":
                this.setState({
                    showCheckBoxes: !this.state.showCheckBoxes
                })
                break;

            // Uncheck all the checked items
            case "uncheck":
                this.uncheckAllItems();
                break;

            // Delete checked items
            case "dltcheck":
                this.deleteCheckedItems();
                break;


            default:
                break;
        }
    }

    onKeyPressFn(e, isCompletedStatus = false) {
        try {
            let arrayValues = _.cloneDeep(this.state.notesBodyData);
            if (e.charCode === 13) {
                if (arrayValues.taskList[arrayValues.taskList.length - 1].task === "") {
                    return
                }
                arrayValues.taskList.push({ "id": arrayValues.taskList.length + 1, "task": "", "isCompleted": isCompletedStatus ? 0 : 1 })
                this.setState({
                    notesBodyData: arrayValues
                }, () => {
                    document.getElementById(`taskName${arrayValues.taskList.length}`).focus()
                })
                e.preventDefault()
            }

        } catch (error) {
            console.error(error)
        }
    }

    resetStates() {
        this.setState(this.initialStateValues);
    }

    archiveFunction() {
        try {
            let body = {
                data: this.state.notesBodyData,
                isArchive: true
            }
            let resp = archiveCommonFunction(body, this.state.localStorage[constants.ArchiveNotes]);
            if (resp) {
                console.log(resp);
                this.props.closeDivProps(true);
            } else {

            }
        } catch (error) {
            console.error(error);
        }

    }

    render() {
        return (
            <div className="bodyNotesDisplay">
                <div className="noteDisplayBox m20">
                    <div className="headerTitle noteTitleDisplay row">
                        <NotesTitle onInputChange={this.handleInputChange} className=" col-md-10 titleClass borderLessInput"></NotesTitle>
                        <div className={`col-md-2 ${!this.state.notesBodyData.isPinned ? 'opacityLess' : ""}`} onClick={() => this.pinNote()}> <i className="fa fa-thumb-tack" aria-hidden="true"></i></div>
                    </div>
                    <div className="headerBody">
                        {
                            this.state.notesBodyData.taskList && this.state.notesBodyData.taskList.map(({ task, isCompleted, id }, index) => {
                                return (
                                    isCompleted === 0 ?
                                        <div className="row" key={'Incomplete' + id}>
                                            {this.state.showCheckBoxes && <input className="col-md-1" type="checkbox" onChange={() => this.checkBoxChange(id)} />}
                                            <input className="col-md-9 borderLessInput" autoFocus placeholder={index === 0 ? 'Take a Note...' : ""} onChange={(e) => this.taskChange(e, id)} onKeyPress={(e) => this.onKeyPressFn(e, true)} id={`taskName${id}`} value={task} />
                                            {task !== "" && <i className="col-md-2 fa fa-times" onClick={() => this.deleteTask(id)} aria-hidden="true"></i>}
                                        </div>
                                        :
                                        <div className="row" key={'Completed' + id}>
                                            {this.state.showCheckBoxes && <input className="col-md-1" type="checkbox" checked={isCompleted} onChange={() => this.checkBoxChange(id, true)} />}
                                            <input className="col-md-9 borderLessInput strikeThrough" autoFocus onChange={(e) => this.taskChange(e, id)} id={`taskName${id}`} onKeyPress={(e) => this.onKeyPressFn(e)} value={task} />
                                            <i className="col-md-2 fa fa-times" onClick={() => this.deleteTask(id)} aria-hidden="true"></i>
                                        </div>
                                )
                            })
                        }


                        {/* <NotesBody keyPress={this.onKeyPress} onInput={this.handleInputChange} className="borderLessInput"></NotesBody> */}
                    </div>


                    <div className={`footerNote row`}>
                        <i className="col-md-2 fa fa-bell" aria-hidden="true"></i>
                        <i className="col-md-2 fa fa-palette" aria-hidden="true">C</i>
                        <i className="col-md-2 fa fa-picture-o" aria-hidden="true"></i>
                        <i className="col-md-2 fa fa-file-archive-o" onClick={() => this.archiveFunction()} aria-hidden="true"></i>

                        <div className="dropdown col-md-2">
                            <i className="col-md-2 fa fa-ellipsis-v" onClick={(e) => this.toggleDropDownFunction(e)}></i>
                            <div id="myDropdown" className="dropdown-content notAllowOpen">
                                <span onClick={() => this.dropDownEvents("delete")}>Delete Note</span>
                                <span onClick={() => this.dropDownEvents("copy")}>Make a Copy</span>
                                {(_.findIndex(this.state.notesBodyData.taskList, (num) => num.isCompleted === 1) > -1) &&
                                    <React.Fragment><span onClick={() => this.dropDownEvents("uncheck")}>Uncheck all items</span>
                                        <span onClick={() => this.dropDownEvents("dltcheck")}>Delete checked items</span>
                                    </React.Fragment>}
                                <span onClick={() => this.dropDownEvents("checkbox")}>{this.state.showCheckBoxes ? "Hide Checkboxes" : "Show Checkboxes"}</span>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <Buttons onClick={() => this.submitBtn()}>Save</Buttons>
                        </div>
                        {/* <button className="col-md-3" type="button" onClick={() => this.submitBtn()}>Close</button> */}





                    </div>




                </div>
            </div>
        )
    }

}

export default NewNotesComponent