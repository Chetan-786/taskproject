const express = require('express');
const router = express.Router();


router.post('/deleteTask', (req, res) => {
    console.log(req.body.isComplete);
    res.send({ "deletedTask": req.body.taskId })
})

router.post('/submitTaskStatus', (req, res) => {
    console.log(req.body.isComplete);
    let body = { "isComplete": req.body.isComplete }
    res.send(body);
})

module.exports = router;