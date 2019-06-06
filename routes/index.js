module.exports = app => {
    app.use('/acts', require('./act'));
    app.use('/users', require('./user'));
    app.use('/countries', require('./country'));
    app.use('/forms', require('./form'));
    app.use('/publishers', require('./publisher'));
    app.use('/statuses', require('./status'));
    app.use('/auth', require('./auth'));
};
