const express = require('express');
const { body, validationResult } = require('express-validator');
const { error } = require('toastr');
const db = require('../dbconnection');
const { commonErrorResponse, errorResponse, successResponse } = require('../sendResponse');
const router = express.Router();


router.post('/', [

    body('username', 'Invalid Email Address').isEmail(),
    body('firstname', "First Name is Mandatory").notEmpty(),
    body('lastname', "Last Name is Mandatory").notEmpty(),
    body('password', "Password is Mandatory").notEmpty(),
    body('confirmpwd', "Confirm Password is Mandatory").notEmpty(),
    body('password', "Password must be between 8 to 14 digits").isLength({ min: 8, max: 14 }),
    body('confirmpwd').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password and Confirmation Password does not match");
        }
        return true;
    })
], (req, res) => {
    try {
        const { firstname, lastname, username, password, confirmpwd } = req.body;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, "", errors.errors[0].msg);
        }
        db.query(`Select * from userstable where email=?`, username, (err, result, fields) => {
            if (err) {
                return errorResponse(res, result, "Something went wrong");
            } else {
                if (result.length) {
                    return errorResponse(res, "", "Username Already Exists")
                } else {
                    db.query(`Insert Into userstable Values(${0},"${firstname}","${lastname}",
        "${username}","${password}")`, (err, result) => {
                        if (err) {
                            errorResponse(res, result, "Something went wrong");
                        } else {
                            successResponse(res, "Success", "Registered Successfully");
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