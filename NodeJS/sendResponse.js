const response = require(`./constants`)

const successResponse = (res, data, msg, status = 200) => {
    response.successResp.message.data = data;
    response.successResp.message.message = msg;
    res.status(status).send(response.successResp.message);
}

const errorResponse = (res, data, msg, status = 200) => {
    response.errorResp.message.message = msg;
    response.errorResp.message.data = data;
    res.status(status).send(response.errorResp.message);
}

const commonErrorResponse = (res) => {
    response.errorResp.message.data = "Something went wrong. Please try again!!";
    response.errorResp.message.message = "Something went wrong. Please try again!!";
    res.status(status).send(response.errorResp.message);
}

module.exports = {
    successResponse,
    errorResponse,
    commonErrorResponse
}