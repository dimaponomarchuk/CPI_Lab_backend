require('dotenv').config({
    path: '.env.' + process.env.NODE_ENV
});

const express = require('express');
const db = require('./db/models');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
    port: 3306,
    user: process.env.DB_USERNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
});

const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000,
        httpOnly: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
require('./services/authenticate')(passport);
app.use(helmet());

require('./routes')(app);
const port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);

db.sequelize.sync()
    .then(() => console.log('Database is connected'))
    .catch(() => console.log('Database connect error'));

module.exports = app;
