const express = require('express');
const db = require('./models');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);

db.sequelize.sync()
    .then(() => console.log('Database is connected'))
    .catch(() => console.log('Database connect error'));

module.exports = app;
