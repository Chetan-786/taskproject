const express = require('express');
const db = require('../dbconnection');
const { successResponse, commonErrorResponse, errorResponse } = require('../sendResponse');
const router = express.Router();


router.post('/', (req, res) => {
    try {
        db.query('Select email from userstable where email= ?', [req.body.username], (err, results) => {
            if (err) {
                errorResponse(res, "", "Something went wrong");
            } else {
                if (!results.length) {
                    errorResponse(res, "", "No User Found")
                } else {
                    db.query(`Select password from userstable where password=?`, [req.body.password], (err, result) => {
                        if (err) {
                            errorResponse(res, "", "Something went wrong");
                        } else {
                            if (result.length > 0) {
                                successResponse(res, result, "Login Success");
                            } else {
                                errorResponse(res, "", "You entered wrong password")
                            }
                        }
                    })
                }
            }

        })

    } catch (error) {
        commonErrorResponse(res);
    }

})


module.exports = router;