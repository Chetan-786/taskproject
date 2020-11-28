const express = require('express');
const sendResponseApi = require('../sendResponse')
const constants = require('../constants');
const { successResponse, commonErrorResponse } = require('../sendResponse');
const router = express.Router();

router.get('/getNotes', (req, res) => {
    try {

        const obj = [{
            noteTitle: "Mon",
            taskList: [{ "id": 1, "task": "Sleepings", "isCompleted": 1 }, { "id": 2, "task": "Eatings", "isCompleted": 0 }],
            createTimeStamp: "100055550",
            userId: "34511",
            noteId: 1,
            isPinned: 1,
            backgroundColor: "#ffff",
            backgroundImg: ".jpg",
        },
        {
            noteTitle: "Tue",
            taskList: [{ "id": 1, "task": "Drinking", "isCompleted": 1 }, { "id": 2, "task": "Eating", "isCompleted": 0 },
            { "id": 3, "task": "Homework", "isCompleted": 1 }, { "id": 4, "task": "Partying", "isCompleted": 1 }],
            createTimeStamp: "100055550",
            userId: "34511",
            noteId: 2,
            isPinned: 1,
            backgroundColor: "#ffff",
            backgroundImg: ".jpg",
        },
        {
            noteTitle: "Wed",
            taskList: [{ "id": 1, "task": "Sleeping", "isCompleted": 1 }, { "id": 2, "task": "Sitting", "isCompleted": 0 }],
            createTimeStamp: "100055550",
            userId: "34511",
            noteId: 3,
            isPinned: 0,
            backgroundColor: "#ffff",
            backgroundImg: ".jpg",
        },
        {
            noteTitle: "Thu",
            taskList: [{ "id": 1, "task": "Sleeping", "isCompleted": 1 }, { "id": 2, "task": "Standing", "isCompleted": 0 }],
            createTimeStamp: "100055550",
            userId: "34511",
            noteId: 4,
            isPinned: 1,
            backgroundColor: "#ffff",
            backgroundImg: ".jpg",
        },
        {
            noteTitle: "Friday",
            taskList: [{ "id": 1, "task": "Worling", "isCompleted": 1 }, { "id": 2, "task": "Eating", "isCompleted": 0 }],
            createTimeStamp: "100055550",
            userId: "34511",
            noteId: 5,
            isPinned: 0,
            backgroundColor: "#ffff",
            backgroundImg: ".jpg",
        },
        {
            noteTitle: "Sat",
            taskList: [{ "id": 1, "task": "Drinking", "isCompleted": 1 }, { "id": 2, "task": "Eating", "isCompleted": 0 }],
            createTimeStamp: "100055550",
            userId: "34511",
            noteId: 6,
            isPinned: 1,
            backgroundColor: "#ffff",
            backgroundImg: ".jpg",
        },]
        successResponse(res, obj, "Success");
    } catch (error) {
        commonErrorResponse(res)
        console.error(error);
    }
})

router.get('/getArchivedNotes', (req, res) => {
    const obj = [{
        noteTitle: "Friday",
        taskList: [{ "id": 1, "task": "Sleeping", "isCompleted": 1 }, { "id": 2, "task": "Eating", "isCompleted": 0 }],
        createTimeStamp: "100055550",
        userId: "34511",
        noteId: 1,
        isPinned: 1,
        backgroundColor: "#ffff",
        backgroundImg: ".jpg",
    }]
    constants.message.isSuccess = true;
    constants.message.data = obj;
    sendResponseApi.successResponse(res, constants.message);
})

router.get('/getDeletedNotes', (req, res) => {
    const obj = [{
        noteTitle: "Friday",
        taskList: [{ "id": 1, "task": "Sleeping", "isCompleted": 1 }, { "id": 2, "task": "Eating", "isCompleted": 0 }],
        createTimeStamp: "100055550",
        userId: "34511",
        noteId: 1,
        isPinned: 1,
        backgroundColor: "#ffff",
        backgroundImg: ".jpg",
    }]
    constants.message.isSuccess = true;
    constants.message.data = obj;
    sendResponseApi.successResponse(res, constants.message);
})

router.post('/deleteTask', (req, res) => {
    // console.log(req.body.taskId)
    res.send("obj");
})

router.post('/pinNote', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

router.post('/saveNotesData', (req, res) => {
    console.log(req.body);
    res.send(req.body)
})

router.post('/deleteNotes', (req, res) => {
    console.log(req.body);
    res.send(req.body)
})

router.post('/archiveNotes', (req, res) => {
    console.log(req.body);
    // Archive and unarchive based on parameter
    //if body.isarchive is true then archive it else unarchive
    res.send(req.body);
})

module.exports = router