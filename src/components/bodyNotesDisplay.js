import React, { Component } from "react";
import CommonService from "../services";
import constants from "../constants";
import toastr from 'toastr';
import _ from 'lodash';
import { saveNotesCommonFunction, deleteNoteCommonFn, archiveCommonFunction } from "./utils";

class DisplayBodyNotes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notesValuesPinned: [],
            notesValuesUnPinned: [],
            showBigModal: false,
            showCheckBoxes: true,
            localStorage: JSON.parse(localStorage.getItem(constants.LocalStorageGetAllApi)),
        }
        this.onHoverFunction = this.onHoverFunction.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.pinNote = this.pinNote.bind(this);
        this.submitBtn = this.submitBtn.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.taskChange = this.taskChange.bind(this);
        this.toggleDropDownFunction = this.toggleDropDownFunction.bind(this);
        this.dropDownEvents = this.dropDownEvents.bind(this);
        this.archiveFunction = this.archiveFunction.bind(this);
        this.onKeyPressFn = this.onKeyPressFn.bind(this);
    }


    componentDidMount() {
        this.loadNotesData()
    }
    // static getDerivedStateFromProps(props, state){
    //     if((props.callApiFnProps !== state.callApiFnProps) && props.callApiFnProps){
    //         loadNotesData
    //     }
    // }
    componentDidUpdate(prevProps) {
        if ((prevProps.callApiFnProps !== this.props.callApiFnProps) && this.props.callApiFnProps) {
            this.loadNotesData()
        }
    }
    /**
     * Call api to Get All Notes Data on load
     */
    async loadNotesData() {
        try {
            console.log("Page Name====>", this.props.page)
            let req = {
                "method": "GET",
                "url": this.state.localStorage[this.props.page ? this.props.page : constants.GetNotes]
            }
            let resp = await CommonService(req);
            if (resp.isSuccess) {
                const isPinnedArr = _.filter(resp.data, (o) => o.isPinned === 1);
                const isUnPinnedArr = _.filter(resp.data, (o) => o.isPinned === 0);
                this.setState({
                    notesValuesPinned: isPinnedArr ? isPinnedArr : [],
                    notesValuesUnPinned: isUnPinnedArr ? isUnPinnedArr : [],
                })
            }
            console.log(this.state.notesValuesPinned)
        } catch (error) {
            console.error(error)
        }


    }
    /**
     * Call api to delete a particular task
     * @param {Number} id  Unique taskid of the task
     * @param {Array} arrValues Array values whether its unpinned array or pinned array
     * @param {Number} noteId Unique Note Id
     * @param {Boolean} isPinned Check if its pinned or not to update appropriate state
     */
    async deleteTask(taskId, arrValues, noteId, isPinned = false, isArray = false) {
        try {
            debugger;
            let req = {
                "method": "POST",
                "url": this.state.localStorage[constants.DeleteTask],
                "body": { "taskId": taskId }
            }
            let resp = await CommonService(req);
            if (resp) {
                const arrValuesData = _.cloneDeep(arrValues);

                const findNoteId = _.findIndex(arrValuesData, (num) => num.noteId === noteId);
                if (findNoteId < 0) {
                    return
                }
                for (let i = 0; i < (isArray ? taskId.length : 1); i++) {
                    const findTaskId = _.findIndex(arrValuesData[findNoteId].taskList, (num) => num.id === (isArray ? taskId[i].id : taskId));
                    if (findTaskId < 0) {
                        return
                    }
                    arrValuesData[findNoteId].taskList.splice(findTaskId, 1);
                    if (arrValuesData[findNoteId].taskList.length === 0) {
                        arrValuesData[findNoteId].taskList.push({ "id": 1, "task": "", "isCompleted": 0 })
                    }
                }

                if (isPinned) {
                    this.setState({
                        notesValuesPinned: arrValuesData
                    })
                } else {
                    this.setState({
                        notesValuesUnPinned: arrValuesData
                    })
                }
            }
        } catch (error) {
            console.error(error);
        }

    }

    onHoverFunction(data, id, clicked = false) {
        if (!clicked) {
            const getClass = document.querySelectorAll('.footerNote' + id);//document.getElementsByClassName('footerNote' + id);
            for (let item of getClass) {
                item.classList.toggle('hiddenFooterNote');
            }
        } else {
            const names = ["I"];
            // clicked.target.classList.contains("notAllowOpen")
            if (names.includes(clicked.target.tagName) || clicked.target.classList.contains("notAllowOpen") || clicked.target.parentNode.classList.contains("notAllowOpen")) {
                return;
            }
            const getClassOfNote = document.querySelector('.uniqueClass' + id);
            if (!getClassOfNote.classList.contains('activeClass')) {
                this.setState({ showBigModal: true });
                getClassOfNote.classList.add('activeClass');
            } else {
                // getClassOfNote.classList.remove('activeClass')
            }
        }
    }

    /**
     * Call api To make a task complete or incomplete based on checkbox value changes
     * @param {Number} noteId 
     * @param {Number} taskId 
     * @param {Boolean} val 
     * @param {Array} arrayValues 
     * @param {Boolean} isPinned 
     */
    async checkBoxChange(noteId, taskId, val = false, arrayValues, isPinned = false) {
        try {
            let req = {
                "method": "POST",
                "url": this.state.localStorage[constants.TaskStatus],
                "body": { "isComplete": val ? 1 : 0 }
            }
            let resp = await CommonService(req);
            if (resp) {
                let notesVal = _.cloneDeep(arrayValues);
                const findNoteIndex = _.findIndex(notesVal, (o) => o.noteId === noteId);
                if (findNoteIndex < 0) {
                    return
                }
                const findTaskIndex = _.findIndex(notesVal[findNoteIndex].taskList, (o) => o.id === taskId);
                if (findTaskIndex < 0) {
                    return
                }
                notesVal[findNoteIndex].taskList[findTaskIndex].isCompleted = resp.isComplete;

                if (isPinned) {
                    this.setState({
                        notesValuesPinned: notesVal
                    })
                } else {
                    this.setState({
                        notesValuesUnPinned: notesVal
                    })
                }
            } else {
                toastr.error("Error")
            }


        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Call api to pin note or unpin note
     * @param {Number} noteId 
     * @param {Array} arrayValues 
     */
    async pinNote(noteId, isPinned = false) {
        try {
            debugger;
            let req = {
                "method": "POST",
                "url": this.state.localStorage[constants.PinNote],
                "body": { "isPinned": isPinned, "noteId": noteId }
            }
            let resp = await CommonService(req);
            if (resp) {
                const arrayValuesData = _.cloneDeep(isPinned ? this.state.notesValuesPinned : this.state.notesValuesUnPinned);
                const findNoteId = _.findIndex(arrayValuesData, (num) => num.noteId === noteId);
                if (findNoteId < 0) return;
                arrayValuesData[findNoteId].isPinned = isPinned ? 0 : 1;

                const getClassOfNote = document.querySelector('.uniqueClass' + noteId);
                // if (getClassOfNote.classList.contains('activeClass')) {
                //     if (isPinned) {
                //         this.setState({
                //             notesValuesPinned: arrayValuesData,
                //         })
                //     } else {
                //         this.setState({
                //             notesValuesUnPinned: arrayValuesData,
                //         })
                //     }
                //     // this.setState({
                //     //     notesValuesPinned: !isPinned ? insertArrayValuesData : arrayValuesData,
                //     //     notesValuesUnPinned: isPinned ? insertArrayValuesData : arrayValuesData,
                //     // })
                // } else {
                const insertArrayValuesData = _.cloneDeep(!isPinned ? this.state.notesValuesPinned : this.state.notesValuesUnPinned);
                insertArrayValuesData.unshift(arrayValuesData[findNoteId]);
                arrayValuesData.splice(findNoteId, 1);
                this.setState({
                    notesValuesPinned: !isPinned ? insertArrayValuesData : arrayValuesData,
                    notesValuesUnPinned: isPinned ? insertArrayValuesData : arrayValuesData,
                })
                // }
                // this.setState({
                //     notesValuesPinned: !isPinned ? insertArrayValuesData : arrayValuesData,
                //     notesValuesUnPinned: isPinned ? insertArrayValuesData : arrayValuesData,
                // })
            } else {
                toastr.error("Error")
            }


        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Used to call api after form submit of a particular note
     * @param {Number} noteId 
     * @param {Array} arrayValues 
     */
    submitBtn(noteId, arrayValues, isPinned = false) {
        debugger;
        const findNoteIndex = _.findIndex(arrayValues, (num) => num.noteId === noteId);
        if (findNoteIndex < 0) {
            return
        }
        let resp = saveNotesCommonFunction(arrayValues[findNoteIndex], this.state.localStorage[constants.SaveNotes]);

        if (resp) {
            const getClassOfNote = document.querySelector('.uniqueClass' + noteId);
            if (getClassOfNote.classList.contains('activeClass')) {
                getClassOfNote.classList.remove('activeClass');
            }
            const getClass = document.querySelectorAll('.footerNote' + noteId);//document.getElementsByClassName('footerNote' + id);
            getClass[0].classList.toggle('hiddenFooterNote');
            getClass[1].classList.toggle('hiddenFooterNote');
            if (isPinned) {
                this.setState({
                    notesValuesPinned: arrayValues
                })
            } else {
                this.setState({
                    notesValuesUnPinned: arrayValues
                })
            }
            this.setState({
                showBigModal: false
            })
        }
    }
    /**
     * Used to detect Title Change
     * @param {*} e 
     * @param {*} arrValues 
     * @param {*} index 
     * @param {*} isPinned 
     */
    titleChange(e, arrValues, index, isPinned = false) {
        try {
            arrValues[index].noteTitle = e.target.value;
            if (isPinned) {
                this.setState({
                    notesValuesPinned: arrValues
                })
            } else {
                this.setState({
                    notesValuesUnPinned: arrValues
                })
            }
        } catch (error) {
            console.error(error);
        }

    }
    /**
     * Used to detect change in Task List
     * @param {event} e 
     * @param {Array} arrValues 
     * @param {Number} noteId 
     * @param {Number} taskId 
     * @param {Boolean} isPinned 
     */
    taskChange(e, arrValues, noteId, taskId, isPinned = false) {
        try {
            let arrayValues = _.cloneDeep(arrValues);
            const findNoteIndex = _.findIndex(arrayValues, (num) => num.noteId === noteId);
            if (findNoteIndex < 0) return;
            const findTaskIndex = _.findIndex(arrayValues[findNoteIndex].taskList, (num) => num.id === taskId);
            if (findTaskIndex < 0) return;

            arrayValues[findNoteIndex].taskList[findTaskIndex].task = e.target.value;

            if (isPinned) {
                this.setState({
                    notesValuesPinned: arrayValues
                })
            } else {
                this.setState({
                    notesValuesUnPinned: arrayValues
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    toggleDropDownFunction(e, noteId) {
        document.getElementById(`myDropdown${noteId}`).classList.toggle('show');
        e.stopPropagation();
    }

    /**
     * Used to call api Function to delete Notes
     * @param {Number} noteId 
     * @param {Array} arrayValues 
     * @param {Boolean} isPinned 
     * @param {Boolean} dltforever 
     */
    deleteNote(noteId, arrayValues, isPinned = false, dltforever = false) {
        try {
            const findNoteIndex = _.findIndex(arrayValues, (num) => num.noteId === noteId);
            // give all data to BE to insert it in Delete notes Table
            let body = {
                "data": arrayValues[findNoteIndex],
                "dltforever": dltforever ? 1 : 0
            }
            let resp = deleteNoteCommonFn(body, this.state.localStorage[constants.DeleteNotes])
            if (resp) {
                arrayValues.splice(findNoteIndex, 1);
                // dlt note
                if (isPinned) {
                    this.setState({
                        notesValuesPinned: arrayValues
                    })
                } else {
                    this.setState({
                        notesValuesUnPinned: arrayValues
                    })
                }
                // close the tab
                console.log(resp);
            }
        } catch (error) {
            console.error(error);
        }

    }

    deleteCheckedItems(noteId, arrayValues, isPinned) {
        try {
            const findNoteIndex = _.findIndex(arrayValues, (num) => num.noteId === noteId);
            if (findNoteIndex < 0) return;
            const findCheckedItems = _.filter(arrayValues[findNoteIndex].taskList, (num) => num.isCompleted === 1);
            this.deleteTask(findCheckedItems, arrayValues, noteId, isPinned, true);
        } catch (error) {
            console.error(error);
        }
    }

    uncheckAllItems(noteId, arrayValuesData, isPinned = false) {
        try {
            let arrayValues = _.cloneDeep(arrayValuesData);
            const findNoteIndex = _.findIndex(arrayValues, (num) => num.noteId === noteId);
            for (const item of arrayValues[findNoteIndex].taskList) {
                if (item.isCompleted === 1) {
                    item.isCompleted = 0;
                }
            }
            if (isPinned) {
                this.setState({
                    notesValuesPinned: arrayValues
                })
            } else {
                this.setState({
                    notesValuesUnPinned: arrayValues
                })
            }
        } catch (error) {
            console.error(error);
        }

    }

    dropDownEvents(val, noteId, arrayValues, isPinned = false) {
        switch (val) {

            // Delete Note
            case "delete":
                this.deleteNote(noteId, arrayValues, isPinned);
                break;

            // Make a Copy
            case "copy":
                this.submitBtn(noteId, arrayValues, isPinned);
                break;

            // CheckBox Display Flag
            case "checkbox":
                this.setState({
                    showCheckBoxes: !this.state.showCheckBoxes
                })
                break;

            // Uncheck all the checked items
            case "uncheck":
                this.uncheckAllItems(noteId, arrayValues, isPinned);
                break;

            // Delete checked items
            case "dltcheck":
                this.deleteCheckedItems(noteId, arrayValues, isPinned);
                break;
            default:
                break;
        }
    }

    archiveFunction(arr, noteId, isPinned = false) {
        try {
            let arrayValues = _.cloneDeep(arr);
            const findNoteIndex = _.findIndex(arrayValues, (num) => num.noteId === noteId);
            if (findNoteIndex < 0) {
                return
            }
            let body = {
                data: arrayValues[findNoteIndex],
                isArchive: !this.props.page ? true : false
            }
            let resp = archiveCommonFunction(body, this.state.localStorage[constants.ArchiveNotes]);
            if (resp) {
                arrayValues.splice(findNoteIndex, 1);
                if (isPinned) {
                    this.setState({
                        notesValuesPinned: arrayValues
                    })
                } else {
                    this.setState({
                        notesValuesUnPinned: arrayValues
                    })
                }
                console.log(resp);
            } else {

            }
        } catch (error) {
            console.error(error);
        }

    }

    onKeyPressFn(e, arrayValuesData, noteId, isCompletedStatus = false, isPinned = false) {
        try {
            let arrayValues = _.cloneDeep(arrayValuesData);
            if (e.charCode === 13) {
                const findNoteIndex = _.findIndex(arrayValues, (num) => num.noteId === noteId);
                if (findNoteIndex < 0) return;
                if (arrayValues[findNoteIndex].taskList[arrayValues[findNoteIndex].taskList.length - 1].task === "") {
                    return
                }
                arrayValues[findNoteIndex].taskList.push({ "id": arrayValues[findNoteIndex].taskList.length + 1, "task": "", "isCompleted": isCompletedStatus ? 0 : 1 })

                if (isPinned) {
                    this.setState({
                        notesValuesPinned: arrayValues
                    }, () => {
                        document.getElementById(`taskName${noteId}_${arrayValues[findNoteIndex].taskList.length}`).focus()
                    })
                } else {
                    this.setState({
                        notesValuesUnPinned: arrayValues
                    }, () => {
                        document.getElementById(`taskName${noteId}_${arrayValues[findNoteIndex].taskList.length}`).focus()
                    })
                }
                e.preventDefault()
            }

        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (
            <div className="bodyNotesDisplay">
                <div className="row marginRow">
                    {this.state.notesValuesPinned && this.state.notesValuesPinned.map(({ noteId, noteTitle, taskList, createTimeStamp, isPinned }, index) => {
                        return (
                            <div className={`col-md-3 noteDisplayBox uniqueClass${noteId}`} key={'IsPinned' + noteId} onMouseEnter={() => this.onHoverFunction(true, noteId)} onMouseLeave={() => this.onHoverFunction(false, noteId)}
                                onClick={(e) => this.onHoverFunction(true, noteId, e)}>
                                <div className={`${(this.props.page === constants.GetDeletedNotes ? 'notAllowed' : '')} row noteTitleDisplay`} >
                                    {/* <div className="col-md-10 leftAlignClass"> {noteTitle}</div> */}
                                    <input type="text" className="col-md-10 borderLessInput titleClass" onChange={(e) => this.titleChange(e, this.state.notesValuesPinned, index, true)} value={noteTitle} />
                                    {this.props.page !== constants.GetDeletedNotes && <div className={`col-md-2 footerNote${noteId} hiddenFooterNote pinNote notAllowOpen ${!isPinned ? 'opacityLess' : ""}`} onClick={() => this.pinNote(noteId, isPinned)}> <i className="fa fa-thumb-tack" aria-hidden="true"></i></div>}
                                </div>
                                <div className="leftAlignClass">
                                    {
                                        // taskList.length > 0 ? 
                                        taskList.map(({ task, isCompleted, id }, taskIndex) =>
                                            <div key={'pinnedid' + id} className={this.props.page === constants.GetDeletedNotes ? 'notAllowed' : ''}>

                                                <div key={'PinnedIncomplete' + id} className="1">
                                                    {isCompleted === 0 && <div className="editableDiv row">
                                                        {this.state.showCheckBoxes && <input className="col-md-1 notAllowOpen" type="checkbox" checked={isCompleted} onChange={() => this.checkBoxChange(noteId, id, true, this.state.notesValuesPinned, true)} />}
                                                        <input className="col-md-9 borderLessInput" placeholder={taskIndex === 0 ? 'Take a Note...' : ""} onChange={(e) => this.taskChange(e, this.state.notesValuesPinned, noteId, id, true)} onKeyPress={(e) => this.onKeyPressFn(e, this.state.notesValuesPinned, noteId, true, true)} id={`taskName${noteId + '_' + id}`} value={task} />
                                                        {task !== "" && <i className="col-md-2 fa fa-times" onClick={() => this.deleteTask(id, this.state.notesValuesPinned, noteId, true)} aria-hidden="true"></i>}
                                                    </div>}
                                                </div>
                                                <div className="2" key={'PinnedComplete' + id}>
                                                    {isCompleted === 1 && <div className="editableDiv row">
                                                        <div className="lineStraight"></div>
                                                        {this.state.showCheckBoxes && <input type="checkbox" className="col-md-1 notAllowOpen" checked={isCompleted} onChange={() => this.checkBoxChange(noteId, id, false, this.state.notesValuesPinned, true)} />}
                                                        <input className="col-md-9 borderLessInput strikeThrough" onChange={(e) => this.taskChange(e, this.state.notesValuesPinned, noteId, id, true)} onKeyPress={(e) => this.onKeyPressFn(e, this.state.notesValuesPinned, noteId, "", true)} id={`taskName${noteId + '_' + id}`} value={task} />
                                                        <i className="col-md-2 fa fa-times" onClick={() => this.deleteTask(id, this.state.notesValuesPinned, noteId, true)} aria-hidden="true"></i>
                                                    </div>}
                                                </div>

                                            </div>)
                                        // :
                                        // <div className="EmptyNote">
                                        //     Empty Note
                                        // </div>
                                    }
                                    {this.props.page === constants.GetDeletedNotes ?
                                        <div className={`footerNote${noteId} hiddenFooterNote footerNote notAllowOpen row`}>
                                            <img src="../images/deleteforever.png" alt="Delete Forever" height="20px" width="20px" onClick={() => this.deleteNote(noteId, this.state.notesValuesPinned, true, true)} />
                                            <i className="fa fa-trash" aria-hidden="true" onClick={() => this.deleteNote(noteId, this.state.notesValuesPinned, true)}></i>
                                        </div>

                                        : <div className={`footerNote${noteId} hiddenFooterNote footerNote notAllowOpen row`}>
                                            <i className="col-md-2 fa fa-bell" aria-hidden="true"></i>
                                            <i className="col-md-2 fa fa-palette" aria-hidden="true">C</i>
                                            <i className="col-md-2 fa fa-picture-o" aria-hidden="true"></i>
                                            {/* <i className="col-md-2 fa fa-file-archive-o" aria-hidden="true"></i> */}
                                            <img src={this.props.page === constants.GetArchivedNotes ? '../images/unarchive.png' : '../images/archive.png'} height="20px" width="20px"
                                                onClick={() => this.archiveFunction(this.state.notesValuesPinned, noteId, true)} />
                                            {this.state.showBigModal && <button className="col-md-3" type="button" onClick={() => this.submitBtn(noteId, this.state.notesValuesPinned, isPinned)}>Close</button>}
                                            <div className="dropdown">
                                                <i className="col-md-2 fa fa-ellipsis-v" onClick={(e) => this.toggleDropDownFunction(e, noteId)}></i>

                                                <div id={`myDropdown${noteId}`} className="dropdown-content notAllowOpen">
                                                    <span onClick={() => this.dropDownEvents("delete", noteId, this.state.notesValuesPinned, true)}>Delete Note</span>
                                                    <span onClick={() => this.dropDownEvents("copy", noteId, this.state.notesValuesPinned, true)}>Make a Copy</span>
                                                    {(_.findIndex(taskList, (num) => num.isCompleted === 1) > -1) &&
                                                        <React.Fragment>
                                                            <span onClick={() => this.dropDownEvents("uncheck", noteId, this.state.notesValuesPinned, true)}>Uncheck all items</span>
                                                            <span onClick={() => this.dropDownEvents("dltcheck", noteId, this.state.notesValuesPinned, true)}>Delete checked items</span>
                                                        </React.Fragment>
                                                    }
                                                    <span onClick={() => this.dropDownEvents("checkbox")}>{this.state.showCheckBoxes ? "Hide Checkboxes" : "Show Checkboxes"}</span>
                                                </div>
                                            </div>




                                        </div>}
                                </div>
                            </div>

                        )
                    })
                    }
                </div>






                {!this.props.page &&
                    <div className="row marginRow">
                        {this.state.notesValuesUnPinned && this.state.notesValuesUnPinned.map(({ noteId, noteTitle, taskList, createTimeStamp, isPinned }, index) => {
                            return (
                                <div key={'isPinned' + noteId} className={`col-md-3 noteDisplayBox uniqueClass${noteId}`} onMouseEnter={() => this.onHoverFunction(true, noteId)} onMouseLeave={() => this.onHoverFunction(false, noteId)}
                                    onClick={(e) => this.onHoverFunction(true, noteId, e)}>
                                    <div className="row noteTitleDisplay">
                                        <input className="col-md-10 leftAlignClass borderLessInput titleClass" onChange={(e) => this.titleChange(e, this.state.notesValuesUnPinned, index)} value={noteTitle} />
                                        <div className={`col-md-2 footerNote${noteId} hiddenFooterNote pinNote opacityLess`} onClick={() => this.pinNote(noteId, false)} > <i className="fa fa-thumb-tack" aria-hidden="true"></i></div>
                                    </div>
                                    <div className="leftAlignClass">
                                        {
                                            // taskList.length > 0 ? 
                                            taskList.map(({ task, isCompleted, id }, taskIndex) =>
                                                <div key={'id' + id}>

                                                    <div className="1" key={'incomplete' + id}>
                                                        {isCompleted === 0 && <div tabIndex="0" className="editableDiv row">
                                                            {this.state.showCheckBoxes && <input className="col-md-1 notAllowOpen" type="checkbox" checked={isCompleted} onChange={() => this.checkBoxChange(noteId, id, true, this.state.notesValuesUnPinned)} />}
                                                            <input className="col-md-9 borderLessInput" placeholder={taskIndex === 0 ? 'Take a Note...' : ""} onChange={(e) => this.taskChange(e, this.state.notesValuesUnPinned, noteId, id)} onKeyPress={(e) => this.onKeyPressFn(e, this.state.notesValuesUnPinned, noteId, true)} id={`taskName${noteId + '_' + id}`} value={task} />
                                                            {task !== "" && <i className="col-md-2 fa fa-times" onClick={() => this.deleteTask(id, this.state.notesValuesUnPinned, noteId)} aria-hidden="true"></i>}

                                                        </div>}
                                                    </div>
                                                    <div className="2" key={'Completed' + id}>
                                                        {isCompleted === 1 && <div tabIndex="0" className="editableDiv row">
                                                            <div className="lineStraight"></div>
                                                            {this.state.showCheckBoxes && <input className="col-md-1 notAllowOpen" type="checkbox" checked={isCompleted} onChange={() => this.checkBoxChange(noteId, id, false, this.state.notesValuesUnPinned)} />}
                                                            <input className="col-md-9 borderLessInput strikeThrough" onChange={(e) => this.taskChange(e, this.state.notesValuesUnPinned, noteId, id)} onKeyPress={(e) => this.onKeyPressFn(e, this.state.notesValuesUnPinned, noteId)} id={`taskName${noteId + '_' + id}`} value={task} />
                                                            <i className="col-md-2 fa fa-times" onClick={() => this.deleteTask(id, this.state.notesValuesUnPinned, noteId)} aria-hidden="true"></i>
                                                        </div>}
                                                    </div>

                                                </div>)
                                            // :
                                            // <div className="EmptyNote">
                                            //     Empty Note
                                            // </div>
                                        }
                                        <div className={`footerNote${noteId} hiddenFooterNote footerNote notAllowOpen row`}>
                                            <i className="col-md-2 fa fa-bell" aria-hidden="true"></i>
                                            <i className="col-md-2 fa fa-palette" aria-hidden="true">C</i>
                                            <i className="col-md-2 fa fa-picture-o" aria-hidden="true"></i>
                                            {/* <i className="col-md-2 fa fa-file-archive-o" onClick={() => this.archiveFunction(this.state.notesValuesUnPinned, noteId)} aria-hidden="true"></i> */}
                                            <img src='../images/archive.png' height="20px" width="20px" onClick={() => this.archiveFunction(this.state.notesValuesPinned, noteId)} />
                                            {this.state.showBigModal && <button className="col-md-3" type="button" onClick={() => this.submitBtn(noteId, this.state.notesValuesUnPinned, isPinned)}>Close</button>}
                                            <div className="dropdown">
                                                <i className="col-md-2 fa fa-ellipsis-v" onClick={(e) => this.toggleDropDownFunction(e, noteId)}></i>

                                                <div id={`myDropdown${noteId}`} className="dropdown-content notAllowOpen">
                                                    <span onClick={() => this.dropDownEvents("delete", noteId, this.state.notesValuesUnPinned)}>Delete Note</span>
                                                    <span onClick={() => this.dropDownEvents("copy", noteId, this.state.notesValuesUnPinned)}>Make a Copy</span>
                                                    {(_.findIndex(taskList, (num) => num.isCompleted === 1) > -1) &&
                                                        <React.Fragment>
                                                            <span onClick={() => this.dropDownEvents("uncheck", noteId, this.state.notesValuesUnPinned)}>Uncheck all items</span>
                                                            <span onClick={() => this.dropDownEvents("dltcheck", noteId, this.state.notesValuesUnPinned)}>Delete checked items</span>
                                                        </React.Fragment>
                                                    }
                                                    <span onClick={() => this.dropDownEvents("checkbox")}>{this.state.showCheckBoxes ? "Hide Checkboxes" : "Show Checkboxes"}</span>
                                                </div>
                                            </div>



                                        </div>
                                    </div>
                                </div>

                            )
                        })
                        }

                    </div>}
            </div>)
    }
}

export default DisplayBodyNotes