module.exports = app => {
    app.use('/act', require('./act'));
    app.use('/user', require('./user'));
};
