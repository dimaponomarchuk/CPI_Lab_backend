const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';

require('dotenv').config({
    path: path.join(__dirname, '../.env.' + nodeEnv)
});

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: "mysql"
    }
};
