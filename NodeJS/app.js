const express = require('express');
const app = express();
require('dotenv').config();
const config = require('./config');
const userLogin = require('./routes/userLogin');
const userRegister = require('./routes/userRegister');
const notesApi = require('./routes/notes');
const taskApi = require('./routes/task');
const db = require('./dbconnection');
const response = require(`./sendResponse`);
// const { body, validationResult } = require('express-validator');
const { errorResponse, commonErrorResponse, successResponse } = require('./sendResponse');
app.use(express.json());

// to avoid Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
})


app.use('/api/login', userLogin)
app.use('/api/register', userRegister)
app.use('/api/notes', notesApi)
app.use('/api/notes/task', taskApi)

app.get('/', (req, res) => {
    console.log("home index called")
})

app.get('/GETALLAPI', (req, res) => {
    try {
        db.query("Select * from getallapi", (err, result) => {
            if (err) {
                return errorResponse(res, err);
            }
            successResponse(res, result);
        })
    } catch (error) {
        commonErrorResponse(res);
    }
})


const port = process.env.PORT || config.development.port;

app.listen(port, () => console.log(`Running at ${port}`))