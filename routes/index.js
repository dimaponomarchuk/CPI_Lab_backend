module.exports = app => {
    app.use('/acts', require('./act'));
    app.use('/users', require('./user'));
};
