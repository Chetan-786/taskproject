// common service file which will act as common middleware

import toastr from 'toastr';
const axios = require('axios');

// import axios from 'axios'
async function CommonService(data) {

    try {
        if (data.method === 'GET') {
            const resp = await axios.get(data.url);
            if (resp.status === 200 && resp.data) {
                return resp.data;
            } else {
                toastr.error("Failed");
            }
        } else {
            const resp = await axios.post(data.url, data.body);
            if (resp.status === 200 && resp.data) {
                return resp.data;
            } else {
                toastr.error("Failed");
            }
        }
    } catch (error) {
        console.log(error)
        toastr.error("Error");
    }


}

export default CommonService