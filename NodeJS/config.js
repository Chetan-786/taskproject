// const dotenv = require('dotenv').config();

var configDetails = {
    development: {
        port: 4000,
        database: {
            "host": process.env.DB_HOST,
            "user": process.env.DB_USER,
            "password": process.env.DB_PASS,
            "database": process.env.DB_DATABASE
        },
        // database: {
        //     "host": "localhost",
        //     "user": "root",
        //     "password": "che10sonu786",
        //     "database": "googlekeepproj"
        // },

    },
    production: {

    },


}

module.exports = configDetails